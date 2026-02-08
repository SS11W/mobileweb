import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonNote, IonBadge } from '@ionic/react';
import './Tab1.css';
import { useHistory } from 'react-router-dom';
import { add } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string | null;
  note?: string | null;
  createdAt?: Date | null;
};

const Tab1: React.FC = () => {
  const history = useHistory();
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'expenses'), (snap) => {
      const list: ExpenseItem[] = snap.docs
        .map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            title: data.title ?? '',
            amount: Number(data.amount) || 0,
            type: data.type === 'income' ? 'income' : 'expense',
            category: data.category ?? null,
            note: data.note ?? null,
            createdAt: data.createdAt?.toDate?.() ?? null
          } as ExpenseItem;
        })
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      setItems(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const totals = useMemo(() => {
    const income = items.reduce((sum, it) => sum + (it.type === 'income' ? it.amount : 0), 0);
    const expense = items.reduce((sum, it) => sum + (it.type === 'expense' ? it.amount : 0), 0);
    return { income, expense };
  }, [items]);

  const formatCurrency = (n: number) => n.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonLabel>
              <h2>สรุป</h2>
              <p>
                รายรับ: <strong style={{ color: 'var(--ion-color-success)' }}>{formatCurrency(totals.income)}</strong>
                {'  '}รายจ่าย: <strong style={{ color: 'var(--ion-color-danger)' }}>{formatCurrency(totals.expense)}</strong>
              </p>
            </IonLabel>
          </IonItem>

          {loading && (
            <IonItem>
              <IonLabel>กำลังโหลดข้อมูล…</IonLabel>
            </IonItem>
          )}

          {!loading && items.length === 0 && (
            <IonItem>
              <IonLabel>ยังไม่มีรายการ</IonLabel>
            </IonItem>
          )}

          {!loading &&
            items.map((it) => (
              <IonItem key={it.id} button routerLink={`/edit-expense/${it.id}`}>
                <IonLabel>
                  <h2>{it.title}</h2>
                  <p>{it.category ?? 'ไม่ระบุหมวดหมู่'}</p>
                </IonLabel>
                <IonBadge color={it.type === 'income' ? 'success' : 'danger'} slot="end">
                  {it.type === 'income' ? '+' : '-'}{formatCurrency(it.amount)}
                </IonBadge>
              </IonItem>
            ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/add-expense')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
