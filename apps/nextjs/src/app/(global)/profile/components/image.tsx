"use client";
import { FileUploader } from "~/components/file-uploader";
import { useUploadFile } from "~/hooks/use-upload-file";

export const ImageSection = () => {
	const { uploadFiles, progress, uploadedFiles, isUploading } = useUploadFile(
		"imageUploader",
		{ defaultUploadedFiles: [] },
	);

	return (
		<div className="space-y-6">
			<FileUploader
				maxFiles={1}
				maxSize={4 * 1024 * 1024}
				progress={progress}
				onUpload={uploadFiles}
				disabled={isUploading}
			/>
		</div>
	);
};
