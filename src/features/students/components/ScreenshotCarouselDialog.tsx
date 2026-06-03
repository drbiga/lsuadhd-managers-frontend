import { useEffect, useState } from "react";
import studentService, { ScreenshotListItem } from "../services/studentService";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ScreenshotCarouselDialogProps = {
  studentName: string;
  sessionNum: number;
}

export function ScreenshotCarouselDialog({ studentName, sessionNum }: ScreenshotCarouselDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [screenshots, setScreenshots] = useState<ScreenshotListItem[]>([]);
  const [isLoadingScreenshots, setIsLoadingScreenshots] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [screenshotUrlsByName, setScreenshotUrlsByName] = useState<Record<string, string>>({});
  const [failedScreenshotNames, setFailedScreenshotNames] = useState<Record<string, true>>({});
  const [jumpToImageValue, setJumpToImageValue] = useState('');

  const totalScreenshots = screenshots.length;
  const currentScreenshot = screenshots[currentImageIndex];
  const currentScreenshotUrl = currentScreenshot ? screenshotUrlsByName[currentScreenshot.name] : undefined;
  const currentScreenshotFailed = currentScreenshot ? failedScreenshotNames[currentScreenshot.name] : false;

  useEffect(() => {
    if (!isDialogOpen) return;
    let cancelled = false;
    setIsLoadingScreenshots(true);
    studentService.getScreenshotsForSession(studentName, sessionNum)
      .then(data => {
        if (cancelled) return;
        setScreenshots(data);
      })
      .catch(err => {
        console.error('Error listing screenshots:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingScreenshots(false);
      });
    return () => { cancelled = true; };
  }, [isDialogOpen, studentName, sessionNum]);

  useEffect(() => {
    if (!isDialogOpen || !currentScreenshot) return;
    if (screenshotUrlsByName[currentScreenshot.name] !== undefined || failedScreenshotNames[currentScreenshot.name]) return;
    let cancelled = false;
    studentService.getScreenshotForSession(studentName, sessionNum, currentScreenshot.name)
      .then(url => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        setScreenshotUrlsByName(prev => ({ ...prev, [currentScreenshot.name]: url }));
      })
      .catch(err => {
        console.error('Error fetching screenshot:', err);
        if (!cancelled) setFailedScreenshotNames(prev => ({ ...prev, [currentScreenshot.name]: true }));
      });
    return () => { cancelled = true; };
  }, [isDialogOpen, currentScreenshot, studentName, sessionNum, screenshotUrlsByName, failedScreenshotNames]);

  const handleOpenChange = (nextIsOpen: boolean) => {
    setIsDialogOpen(nextIsOpen);
    if (!nextIsOpen) {
      Object.values(screenshotUrlsByName).forEach(URL.revokeObjectURL);
      setScreenshotUrlsByName({});
      setFailedScreenshotNames({});
      setScreenshots([]);
      setIsLoadingScreenshots(false);
      setCurrentImageIndex(0);
      setJumpToImageValue('');
    }
  };

  const handleJumpToImage = () => {
    const targetImageNumber = parseInt(jumpToImageValue, 10);
    if (Number.isNaN(targetImageNumber) || targetImageNumber < 1 || targetImageNumber > totalScreenshots) return;
    setCurrentImageIndex(targetImageNumber - 1);
    setJumpToImageValue('');
  };

  const dialogDescription = isLoadingScreenshots
    ? ''
    : totalScreenshots > 0
    ? `Image ${currentImageIndex + 1} of ${totalScreenshots}`
    : 'No screenshots are available yet';

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          Show Screenshot Carousel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Screenshots - Session #{sessionNum}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center gap-4">
			{isLoadingScreenshots ? (
				<p>Loading...</p>
			) : totalScreenshots === 0 ? (
				<p>No screenshots available for this session</p>
			) : (
				<>
				<div className="w-full flex justify-center items-center min-h-[50vh] bg-gray-100 dark:bg-gray-800 rounded">
					{currentScreenshotFailed ? (
					<p className="text-red-600">Could not load this screenshot</p>
					) : currentScreenshotUrl ? (
					<img
						src={currentScreenshotUrl}
						alt={`Screenshot ${currentImageIndex + 1}`}
						className="max-h-[60vh] max-w-full object-contain"
					/>
					) : (
					<p>Loading...</p>
					)}
				</div>

				<div className="text-sm text-muted-foreground">
					File last modified date:{' '}
					{currentScreenshot
					? new Date(currentScreenshot.last_modified).toLocaleString()
					: '-'}
				</div>

				<div className="flex justify-between items-center w-full gap-2">
					<Button
					variant="outline"
					onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
					disabled={currentImageIndex === 0}
					>
					Previous
					</Button>

					<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">
						{currentImageIndex + 1} / {totalScreenshots}
					</span>

					<Input
						type="number"
						min={1}
						max={totalScreenshots}
						placeholder="Go to #"
						value={jumpToImageValue}
						onChange={e => setJumpToImageValue(e.target.value)}
						onKeyDown={e => {
						if (e.key === 'Enter') handleJumpToImage();
						}}
						className="w-24"
					/>

					<Button
						variant="outline"
						onClick={handleJumpToImage}
						disabled={!jumpToImageValue}
					>
					Go
					</Button>
					</div>

					<Button
					variant="outline"
					onClick={() =>
						setCurrentImageIndex(i => Math.min(totalScreenshots - 1, i + 1))
					}
					disabled={currentImageIndex === totalScreenshots - 1}
					>
					Next
					</Button>
				</div>
				</>
			)}
		</div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
