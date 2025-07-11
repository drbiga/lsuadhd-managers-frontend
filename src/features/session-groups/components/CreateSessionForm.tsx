import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UseFormRegister, UseFormHandleSubmit } from "react-hook-form";

interface CreateSessionFormProps {
	handleSubmit: UseFormHandleSubmit<any>;
	register: UseFormRegister<any>;
	onSubmit: (data: any) => void;	
	defaultSeqnum: number;
}

export function CreateSessionForm(props: CreateSessionFormProps) { 
	const { handleSubmit, register, onSubmit, defaultSeqnum } = props;

  return (
    <Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="absolute bottom-8 right-8">Create new session</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create new session</DialogTitle>
					<DialogDescription>
						Set up the new session. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="seqnum" className="text-right">
								Sequence number
							</Label>
							<Input
								id="seqnum"
								defaultValue={defaultSeqnum}
								className="col-span-3"
								{...register('seqnum')}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="has_feedback" className="text-right">
								Has Feedback
							</Label>
							<Input
								id="has_feedback"
								defaultValue="yes"
								className="col-span-1 p-0 w-4 h-4"
								type="checkbox"
								{...register('has_feedback')}
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="is_passthrough" className="text-right">
								Is Passthrough
							</Label>
							<Input
								id="is_passthrough"
								defaultValue="yes"
								className="col-span-1 p-0 w-4 h-4"
								type="checkbox"
								{...register('is_passthrough')}
							/>
						</div>
					</div>
					<DialogFooter>
						<DialogClose>
							<Button type="submit" variant="outline">Create</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}