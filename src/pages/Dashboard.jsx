import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Cards from "../component/Cards";
import AddExpense from "../component/Modals/AddExpense";
import AddIncome from "../component/Modals/AddIncome";
import EditTransaction from "../component/Modals/EditTransactionModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  getDocs,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import TransactionTable from "../component/TransactionTable";
import BalanceLineChart from "../component/Charts/BalanceLineChart";
import ExpensePieChart from "../component/Charts/ExpensePieChart";
import NoTranscation from "../component/NoTranscation";
import Loading from "../component/Loading";

const Dashboard = () => {
  const [user] = useAuthState(auth); // Gets the current logged-in Firebase user. If not logged in, user is null.

  const [isExpensModalVisible, setExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [transactions, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  const showExpenseModal = () => setExpenseModalVisible(true);
  const cancelExpenseModal = () => setExpenseModalVisible(false);

  const showIncomeModal = () => setIncomeModalVisible(true);
  const cancelIncomeModal = () => setIncomeModalVisible(false);

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setEditModalVisible(true);
  };

  const cancelEditModal = () => {
    setEditModalVisible(false);
    setEditingTransaction(null);
  };

  useEffect(() => {
    calCulateBalance();
  }, [transactions]);

  async function resetBalance() {
    if (!window.confirm("Are you sure? This will delete ALL transactions?"))
      return;

    try {
      const colRef = collection(db, "users", user.uid, "transactions");
      const snapshot = await getDocs(colRef);

      if (snapshot.empty) {
        toast.info("No transactions to delete.");
        return;
      }

      const deletePromises = [];

      snapshot.forEach((docSnap) => {
        const docRef = doc(db, "users", user.uid, "transactions", docSnap.id);
        deletePromises.push(deleteDoc(docRef));
      });

      await Promise.all(deletePromises);

      setTransaction([]);
      toast.success("All transactions deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  }
  const calCulateBalance = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
    setBalance(totalIncome - totalExpense);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    addTransaction(newTransaction);
  };

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );

      toast.success("Transaction Added");

      setTransaction([...transactions, { id: docRef.id, ...transaction }]);

      setIncomeModalVisible(false);
      setExpenseModalVisible(false);
    } catch (err) {
      toast.error(err.message);
    }
  }

  // DELETE transaction
  async function deleteTransaction(id) {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, id));
      setTransaction(transactions.filter((t) => t.id !== id));
      toast.success("Transaction Deleted");
    } catch (err) {
      toast.error(err.message);
    }
  }

  // UPDATE transaction
  async function updateTransaction(updatedTransaction) {
    try {
      const { id, ...rest } = updatedTransaction;

      await updateDoc(doc(db, `users/${user.uid}/transactions`, id), rest);

      setTransaction((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );

      toast.success("Transaction Updated");
      cancelEditModal();
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (user) fetchTransaction();
  }, [user]);

  async function fetchTransaction() {
    setLoading(true);

    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);

      const transactionsArray = [];
      querySnapshot.forEach((docSnap) => {
        transactionsArray.push({ id: docSnap.id, ...docSnap.data() });
      });

      setTransaction(transactionsArray);
      toast.success("Transaction Fetched");
    } catch (err) {
      toast.error(err.message);
    }

    setLoading(false);
  }

  return (
    <div>
      <Header />

      {loading ? (
       <Loading loading={loading}></Loading>
      ) : (
        <>
          <Cards
            showIncomeModal={showIncomeModal}
            showExpenseModal={showExpenseModal}
            income={income}
            expense={expense}
            balance={balance}
            resetBalance={resetBalance}
          />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            cancelIncomeModal={cancelIncomeModal}
            onFinish={onFinish}
          />

          <AddExpense
            isExpensModalVisible={isExpensModalVisible}
            cancelExpenseModal={cancelExpenseModal}
            onFinish={onFinish}
          />

          <EditTransaction
            isEditModalVisible={isEditModalVisible}
            cancelEditModal={cancelEditModal}
            transaction={editingTransaction}
            onUpdate={updateTransaction}
          />

          {transactions.length === 0 ? (
            <NoTranscation />
          ) : (
            <>
              {/* Charts Row */}
              <div
                className="charts-row"
                style={{ padding: "0 20px", marginTop: "20px" }}
              >
                <div className="chart-card">
                  <BalanceLineChart transactions={transactions} />
                </div>

                <div className="chart-card">
                  <ExpensePieChart transactions={transactions} />
                </div>
              </div>

              {/* Table */}
              <TransactionTable
                transactions={transactions}
                onEdit={openEditModal}
                onDelete={deleteTransaction}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
