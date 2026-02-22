import React, { useState, useRef } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { PhotoService } from '../core/photo.service';
import { GeminiVisionService } from '../core/gemini.service';
import type { Base64Image, ImageAnalysisResult } from '../core/ai.interface';

const Tab1Page: React.FC = () => {
  // สร้าง State สำหรับเก็บข้อมูลแทน ref ของ Vue
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<Base64Image | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ฟังก์ชันเมื่อเลือกไฟล์รูปภาพ
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64Image = await PhotoService.fromFile(file);
    setImg(base64Image);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  // ฟังก์ชันเมื่อกดถ่ายภาพจากกล้อง
  const onTakePhoto = async () => {
    setLoading(true);
    try {
      const b64 = await PhotoService.fromCamera();
      setImg(b64);
      setPreviewUrl(`data:${b64.mimeType};base64,${b64.base64}`);
      setResult(null);
    } catch (error) {
      console.error("Camera Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับส่งภาพไปวิเคราะห์
  const onAnalyze = async () => {
    if (!img) return;
    setLoading(true);
    try {
      const analysisResult = await GeminiVisionService.analyze(img);
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lab08: Gemini Vision โดย เอกสิทธิ์</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* ซ่อน input ไฟล์ไว้ และใช้ useRef อ้างอิงเพื่อสั่งคลิกผ่านปุ่มอื่น */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onFileChange}
        />

        <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
          เลือกไฟล์ภาพ
        </IonButton>
        <IonButton expand="block" onClick={onTakePhoto}>
          ถ่ายภาพ (Camera)
        </IonButton>

        {/* เทียบเท่า v-if ใน Vue */}
        {previewUrl && <IonImg src={previewUrl} />}

        <IonButton
          expand="block"
          disabled={!img || loading}
          onClick={onAnalyze}
        >
          วิเคราะห์ภาพ
        </IonButton>

        {loading && <IonSpinner />}

        {result && (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1Page;