import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Types for the API data
interface OrderData {
  Hour: string;
  Order_Count: number;
}

interface ItemData {
  most_bought_item: string;
  least_bought_item: string;
}

interface CumulativePercentageData {
  Date: string;
  Hour: string;
  Cumulative_Percentage: number;
}

// CustomerBehaviorDashboard component
const CustomerBehaviorDashboard: React.FC = () => {
  const [ordersByHour, setOrdersByHour] = useState<OrderData[]>([]);
  const [mostBoughtItem, setMostBoughtItem] = useState<string | null>(null);
  const [leastBoughtItem, setLeastBoughtItem] = useState<string | null>(null);
  const [cumulativePercentage, setCumulativePercentage] = useState<CumulativePercentageData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch orders by hour
  useEffect(() => {
    axios.get('http://localhost:8000/api/orders-by-hour')
      .then((response) => {
        setOrdersByHour(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the orders by hour!', error);
      });
  }, []);

  // Fetch most and least bought items
  useEffect(() => {
    axios.get('http://localhost:8000/api/cumulative_least_most_bought_item')
      .then((response) => {
        const { most_bought_item, least_bought_item }: ItemData = response.data;
        setMostBoughtItem(most_bought_item);
        setLeastBoughtItem(least_bought_item);
      })
      .catch((error) => {
        console.error('There was an error fetching the most and least bought items!', error);
      });
  }, []);

  // Fetch cumulative percentage of customers
  useEffect(() => {
    axios.get('http://localhost:8000/api/cumulative_percentage_of_customers')
      .then((response) => {
        setCumulativePercentage(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching cumulative percentage of customers!', error);
      });
  }, []);

  return (
    <div>
      <h1>Customer Behavior Dashboard</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* Display orders by hour */}
          <h2>Orders by Hour</h2>
          <ul>
            {ordersByHour.map((data, index) => (
              <li key={index}>Hour: {data.Hour}, Orders: {data.Order_Count}</li>
            ))}
          </ul>

          {/* Display most and least bought items */}
          <h2>Most Bought Item</h2>
          <pre>{JSON.stringify(mostBoughtItem, null, 2)}</pre>
          <h2>Least Bought Item</h2>
          <pre>{JSON.stringify(leastBoughtItem, null, 2)}</pre>

          {/* Display cumulative percentage of customers */}
          <h2>Cumulative Percentage of Customers</h2>
          <ul>
            {cumulativePercentage.map((data, index) => (
              <li key={index}>
                Date: {data.Date}, Hour: {data.Hour}, Cumulative Percentage: {data.Cumulative_Percentage.toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CustomerBehaviorDashboard;
