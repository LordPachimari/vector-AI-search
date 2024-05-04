"use client";
import type { UpdateUser } from "@soulmate/validators";
import { useEffect } from "react";
import { FileUploader } from "~/components/file-uploader";
import { useUploadFile } from "~/hooks/use-upload-file";

export const ImageSection = ({
	updateProfile,
}: {
	updateProfile: (updates: UpdateUser["updates"]) => Promise<void>;
}) => {
	const { uploadFiles, progress, uploadedFiles, isUploading } = useUploadFile(
		"imageUploader",
		{ defaultUploadedFiles: [] },
	);
	useEffect(() => {
		if (uploadedFiles.length > 0) {
			updateProfile({ avatarURL: uploadedFiles[0]!.url }).then(() =>
				console.log("saved to db"),
			);
		}
	}, [uploadedFiles, updateProfile]);

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
