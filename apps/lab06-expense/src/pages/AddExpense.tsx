import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const AddExpense: React.FC = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'income' | 'expense' | ''>('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const isValid =
    title.trim().length > 0 &&
    typeof amount === 'number' && amount > 0 &&
    (type === 'income' || type === 'expense');

  const handleSave = async () => {
    if (!isValid) return;
    try {
      setSaving(true);
      await addDoc(collection(db, 'expenses'), {
        title: title.trim(),
        amount,
        type,
        category: category.trim() || null,
        note: note.trim() || null,
        createdAt: serverTimestamp()
      });
      history.push('/tab1');
    } catch (err) {
      // Basic fallback: stay on page; in real apps, show toast/alert
      console.error('Failed to save expense:', err);
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>เพิ่มรายการรายรับ/รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">ชื่อรายการ</IonLabel>
            <IonInput
              value={title}
              onIonInput={(e) => setTitle(e.detail.value ?? '')}
              placeholder="เช่น ค่าอาหารกลางวัน"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">จำนวนเงิน</IonLabel>
            <IonInput
              type="number"
              value={amount as any}
              onIonInput={(e) => {
                const v = e.detail.value ?? '';
                const num = v === '' ? '' : Number(v);
                setAmount(Number.isNaN(num) ? '' : num);
              }}
              placeholder="เช่น 120"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">ประเภท</IonLabel>
            <IonSelect
              value={type}
              placeholder="เลือกประเภท"
              onIonChange={(e) => setType(e.detail.value)}
            >
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">หมวดหมู่</IonLabel>
            <IonSelect
              value={category}
              placeholder="เลือกหมวดหมู่"
              onIonChange={(e) => setCategory(e.detail.value)}
            >
              <IonSelectOption value="salary">เงินเดือน</IonSelectOption>
              <IonSelectOption value="food">อาหาร</IonSelectOption>
              <IonSelectOption value="transport">เดินทาง</IonSelectOption>
              <IonSelectOption value="bills">ค่าสาธารณูปโภค</IonSelectOption>
              <IonSelectOption value="shopping">ช้อปปิ้ง</IonSelectOption>
              <IonSelectOption value="other">อื่นๆ</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">หมายเหตุ</IonLabel>
            <IonTextarea
              value={note}
              onIonInput={(e) => setNote(e.detail.value ?? '')}
              autoGrow
              placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
            />
          </IonItem>
        </IonList>

        <div style={{ padding: 16, display: 'flex', gap: 8 }}>
          <IonButton expand="block" onClick={() => history.push('/tab1')} color="medium" fill="outline">
            ยกเลิก
          </IonButton>
          <IonButton expand="block" onClick={handleSave} disabled={!isValid || saving}>
            {saving ? 'กำลังบันทึก…' : 'บันทึก'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddExpense;
