import { useEffect, useState } from "react";
import CardData from "./components/CardData";
import axios from "axios";
import { API_ROUTES } from "@/routes/api";
import { BASE_URL } from "@/services/config";
import MonthlyBlogChart from "./components/MonthlyBlogChart";
import { DataTable } from "./components/DataTable";
import { columnsView } from "./components/Blog/View/Columns";
import { BlogMainDashboard } from "./components/IBlog";
import { CookiesEmployee2Service } from "@/services/cookies.service";
import MonthlyPaymentChart from "./components/MothlyPaymentChart";
import { columnsLike } from "./components/Blog/Like/Columns";
import { columnsPayment } from "./components/Payment/Columns";
import { PaymentMainDashboard } from "./components/IPayment";

interface NewUserData {
  inMonth: number;
  inYear: number;
  inDay: number;
}

const DashboardMainContainer = () => {
  const [data, setData] = useState<NewUserData>();
  const admin = JSON.parse(CookiesEmployee2Service.get() || "");
  const [revenue, setRevenue] = useState();
  const [transactions, setTransactions] = useState<PaymentMainDashboard[]>([]);
  const [mostView, setMostView] = useState<BlogMainDashboard[]>([]);
  const [mostLike, setMostLike] = useState<BlogMainDashboard[]>([]);

  const fetchNewUserData = async () => {
    const response = await axios.get(`${BASE_URL + API_ROUTES.NEW_DATA_USER}`);
    setData(response.data.resultObj);
  };
  const fetchRevenue = async () => {
    const response = await axios.get(`${BASE_URL + API_ROUTES.GET_REVENUE}`);
    setRevenue(response.data.resultObj);
  };
  const fetchRecentTransactions = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.GET_RECENT_TRANSACTION}`,
      {
        params: {
          quantity: 5,
        },
      }
    );
    setTransactions(response.data.resultObj);
  };
  const fetchBlogMostView = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.BLOG_MOST_VIEW}`,
      {
        params: {
          quantity: 5,
        },
      }
    );
    setMostView(response.data.resultObj);
  };
  const fetchBlogMostLike = async () => {
    const response = await axios.get(
      `${BASE_URL + API_ROUTES.BLOG_MOST_LIKE}`,
      {
        params: {
          quantity: 5,
        },
      }
    );
    setMostLike(response.data.resultObj);
  };

  useEffect(() => {
    fetchNewUserData();
    fetchRevenue();
    fetchRecentTransactions();
    fetchBlogMostView();
    fetchBlogMostLike();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center  text-sky-800 mb-8">
        Welcome, {admin.fullName} 🙌
      </h1>
      <div className="flex items-center justify-around">
        <CardData data={revenue} description={"Revenue"} currency={"VND"} />
        <CardData
          data={data?.inDay}
          description={"In Day"}
          currency={"Users"}
        />
        <CardData
          data={data?.inMonth}
          description={"In Month"}
          currency={"Users"}
        />
        <CardData
          data={data?.inYear}
          description={"In Year"}
          currency={"Users"}
        />
      </div>
      <div className="my-10">
        <p className="text-center font-bold text-sky-900 text-3xl my-10">
          Payments
        </p>
        <MonthlyPaymentChart />
      </div>
      <div className="my-10 flex justify-around">
        <div className="">
          <DataTable columns={columnsPayment} data={transactions} />
        </div>
      </div>
      <div className="my-10">
        <p className="text-center font-bold text-sky-900 text-3xl my-10">
          Blog
        </p>
        <MonthlyBlogChart />
      </div>
      <div className="my-10 flex justify-around">
        <div className="">
          <p className="mb-2">Most likes</p>
          <DataTable columns={columnsLike} data={mostLike} />
        </div>
        <div className="">
          <p className="mb-2">Most views</p>
          <DataTable columns={columnsView} data={mostView} />
        </div>
      </div>
    </div>
  );
};

export default DashboardMainContainer;
