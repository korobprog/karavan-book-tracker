import React, { useState } from "react";
import { message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { updateProfile } from "../../../services/api/useUser";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import "firebase/storage";

type Props = {
  imageUrl?: string;
  onImageUrlChange: (imageUrl: string) => void;
  userId: string;
};

type CustomRequest = {
  file: RcFile | string | Blob; // указываем, что file может быть типом RcFile, string или Blob
  onSuccess: (body: UploadResponse, file: UploadFile) => void;
  onError: (err: Error) => void;
};

type UploadResponse = {
  url: string;
};

export const AvatarUploader = ({ imageUrl, onImageUrlChange, userId, ...restProps }: Props) => {
  const [loading, setLoading] = useState(false);

  const storage = getStorage();

  const beforeUpload = (file: RcFile | string | Blob): boolean => {
    // указываем, что file может быть типом RcFile, string или Blob
    const isJpgOrPng =
      (typeof file !== "string" && file.type === "image/jpeg") ||
      (typeof file !== "string" && file.type === "image/png"); // проверяем тип файла только если файл не является строкой
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt2M = typeof file !== "string" && file.size / 1024 / 1024 < 2; // проверяем размер файла только если файл не является строкой
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    return true;
  };

  const handleChange: UploadProps["onChange"] = async (info: UploadChangeParam<UploadFile>) => {
    console.log("🚀 ~  info:", info);
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      // Получите URL-адрес загрузки из хранилища Firebase
      const storageRef = ref(storage, `avatar/${userId}/${info.file.name}`);
      // setImageUrl(undefined); // Очистите старый URL-адрес изображения, чтобы запустить повторный рендеринг
      try {
        const url = await getDownloadURL(storageRef);
        console.log("🚀 ~ url:", url);
        onImageUrlChange(url);
        setLoading(false);
        // Обновите профиль пользователя с помощью нового URL-адреса аватара
        // await updateProfile(userId, { avatar: url });
      } catch (error) {
        console.error(error);
        message.error("Failed to get the download URL!");
      }
    } else if (info.file.status === "error") {
      message.error(info.file.error?.message ?? "Failed to upload the avatar!");
    }
  };

  const customRequest = async ({ file, onSuccess, onError }: CustomRequest) => {
    if (!(file instanceof File)) {
      return;
    }

    const storageRef = ref(storage, `avatar/${userId}/${file.name}`);
    try {
      const uploadTask = uploadBytes(storageRef, file);
      const snapshot = await uploadTask;
      const url = await snapshot.ref.fullPath;
      console.log("🚀 ~ file: AvatarUploader .tsx:82 ~ customRequest ~ url:", url);

      onSuccess(
        { url },
        {
          uid: (file as RcFile).uid,
          size: file.size,
          name: file.name,
          type: file.type,
          status: "done",
          percent: 100,
        }
      );
      onImageUrlChange(url);
      // await updateProfile(userId, { avatar: url });
    } catch (error) {
      message.error("Failed to upload the avatar!");
      onError(new Error("Failed to upload the avatar!"));
    }
  };

  // eslint-disable-next-line no-empty-pattern
  /*   const customRequest = async ({ file, onSuccess, onError }: CustomRequest) => {
    if (!(file instanceof File)) {
      return;
    }
    
    const storageRef = ref(storage, `avatar/${userId}`);
    try {
      const uploadTask = uploadBytes(storageRef, file as RcFile);
      const url = await uploadTask.then((snapshot) => snapshot.ref.fullPath);
      const response: UploadResponse = { url };
      onSuccess(response, { uid: (file as RcFile).uid, size: file.size, name: file.name, type: file.type, status: 'done', percent: 100 });
      setImageUrl(url);
    } catch (error) {
      message.error("Failed to upload the avatar!");
      onError(new Error('Failed to upload the avatar!'));
    }
  }; */

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      {...restProps}
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      // @ts-ignore
      customRequest={customRequest}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%", borderRadius: '50%' }} /> : uploadButton}
    </Upload>
  );
};
