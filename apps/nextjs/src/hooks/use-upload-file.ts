import * as React from "react";
import { toast } from "sonner";
import type { UploadFilesOptions } from "uploadthing/types";
import type { OurFileRouter } from "~/app/uploadthing/core";
import type { UploadedFile } from "~/types";
import { getErrorMessage } from "~/utils/handle-error";
import { uploadFiles } from "~/utils/uploadthing";

interface UseUploadFileProps
	extends Pick<
		UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
		"headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
	> {
	defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
	endpoint: keyof OurFileRouter,
	{ defaultUploadedFiles = [], ...props }: UseUploadFileProps = {},
) {
	const [uploadedFiles, setUploadedFiles] =
		React.useState<UploadedFile[]>(defaultUploadedFiles);
	const [progress, setProgress] = React.useState<number>(
		0,
	);
	const [isUploading, setIsUploading] = React.useState(false);

	async function uploadThings(files: File[]) {
		setIsUploading(true);
		try {
			const res = await uploadFiles(endpoint, {
				...props,
				files,
				onUploadProgress: ({  progress }) => {
					setProgress(progress);
				},
			});

			setUploadedFiles((prev) => (prev ? [...prev, ...res] : res));
		} catch (err) {
			toast.error(getErrorMessage(err));
		} finally {
			setProgress(0);
			setIsUploading(false);
		}
	}

	return {
		uploadedFiles,
		progress,
		uploadFiles: uploadThings,
		isUploading,
	};
}
