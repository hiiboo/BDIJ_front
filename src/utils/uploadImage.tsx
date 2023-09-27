import axios, { AxiosResponse } from 'axios';

interface FileUploadResponse {
    url: string;
    // 他のレスポンス情報がある場合は追加
}

export const uploadImage = async (file: File): Promise<{ path: string } | null> => {
    const formData = new FormData();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    formData.append('image', file);

    try {
        const response: AxiosResponse<FileUploadResponse> = await axios.post(`${apiUrl}/api/upload-image`, formData, {
            withCredentials: true, // Cookieを送信するための設定
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return { path: response.data.url };
    } catch (error) {
        console.error(error);
        return null;
    }
};