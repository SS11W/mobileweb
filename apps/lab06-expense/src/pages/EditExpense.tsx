import { useEffect, useState } from 'react';
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
  IonBackButton,
  IonAlert
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

type Params = { id: string };

const EditExpense: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<Params>();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'income' | 'expense' | ''>('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, 'expenses', id);
        const snap = await getDoc(ref);
        const data = snap.data() as any;
        if (data) {
          setTitle(data.title ?? '');
          setAmount(Number(data.amount) || '');
          setType(data.type === 'income' ? 'income' : 'expense');
          setCategory(data.category ?? '');
          setNote(data.note ?? '');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const isValid =
    title.trim().length > 0 &&
    typeof amount === 'number' && amount > 0 &&
    (type === 'income' || type === 'expense');

  const handleUpdate = async () => {
    if (!isValid) return;
    try {
      setSaving(true);
      const ref = doc(db, 'expenses', id);
      await updateDoc(ref, {
        title: title.trim(),
        amount,
        type,
        category: category.trim() || null,
        note: note.trim() || null
      });
      history.push('/tab1');
    } catch (err) {
      console.error('Failed to update expense:', err);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      const ref = doc(db, 'expenses', id);
      await deleteDoc(ref);
      history.push('/tab1');
    } catch (err) {
      console.error('Failed to delete expense:', err);
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
          <IonTitle>แก้ไขรายการ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <IonList>
            <IonItem>
              <IonLabel>กำลังโหลดข้อมูล…</IonLabel>
            </IonItem>
          </IonList>
        ) : (
          <>
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

            <div style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <IonButton expand="block" onClick={() => history.push('/tab1')} color="medium" fill="outline">
                ยกเลิก
              </IonButton>
              <IonButton expand="block" onClick={handleUpdate} disabled={!isValid || saving}>
                {saving ? 'กำลังบันทึก…' : 'อัปเดต'}
              </IonButton>
              <IonButton expand="block" color="danger" fill="outline" onClick={() => setConfirmOpen(true)} disabled={saving}>
                ลบรายการ
              </IonButton>
            </div>

            <IonAlert
              isOpen={confirmOpen}
              onDidDismiss={() => setConfirmOpen(false)}
              header="ยืนยันการลบ"
              message="ต้องการลบรายการนี้หรือไม่?"
              buttons={[
                { text: 'ยกเลิก', role: 'cancel' },
                { text: 'ลบ', role: 'destructive', handler: handleDelete }
              ]}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EditExpense;
