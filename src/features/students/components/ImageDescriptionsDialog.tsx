import { useState } from "react";
import studentService, { ImageDescription } from "../services/studentService";
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

const PAGE_SIZE = 10;

type ImageDescriptionsDialogProps = {
  studentName: string;
  sessionNum: number;
}

export function ImageDescriptionsDialog({ studentName, sessionNum }: ImageDescriptionsDialogProps) {
  const [descriptions, setDescriptions] = useState<ImageDescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPage = async (loadMore: boolean) => {
    setLoading(true);
    try {
      const offset = loadMore ? descriptions.length : 0;
      const data = await studentService.getImageDescriptionsForSession(
        studentName,
        sessionNum,
        offset,
        PAGE_SIZE
      );
      setDescriptions(prev => loadMore ? [...prev, ...data] : data);
      setHasFetched(true);
    } catch (err) {
      console.error('Error fetching image descriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = async (open: boolean) => {
    if (!open || hasFetched) return;
    await fetchPage(false);
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          View Image Descriptions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Image Descriptions - Session #{sessionNum}</AlertDialogTitle>
          <AlertDialogDescription>
            OpenAI-generated descriptions ({descriptions.length} loaded)
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading && descriptions.length === 0 ? (
            <p>Loading...</p>
          ) : descriptions.length === 0 ? (
            <p>No descriptions found.</p>
          ) : (
            <>
              {descriptions.map((desc, index) => (
                <div key={desc.image_path} className="border rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(desc.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{desc.response}</p>
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => fetchPage(true)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
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
