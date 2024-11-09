import pandas as pd
import matplotlib as plt
import seaborn as sns
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

df=pd.read_csv("/Users/roshankosaraju/Desktop/datathon/datasets/Roni_s Challenge public/Provided Data [FINAL]/april_2024.csv")



df['Sent Date']= pd.to_datetime(df["Sent Date"])
buy_freq= df["Parent Menu Selection"].value_counts()
orders_by_date = df.groupby([df['Sent Date'].dt.date, 'Parent Menu Selection']).size().reset_index(name='Order Count')
df['Hour'] = df['Sent Date'].dt.hour
orders_by_hour = df.groupby(['Hour', 'Parent Menu Selection']).size().reset_index(name='Order Count')

@app.get("/api/orders-by-hour", response_model=List[OrderData])
async def get_orders_by_hour():
         df = pd.read_csv("/path/to/your/csv")
         df['Sent Date'] = pd.to_datetime(df["Sent Date"])
         df['Hour'] = df['Sent Date'].dt.hour
         orders_by_hour = df.groupby('Hour').size().reset_index(name='Order Count')
                
         result = [OrderData(Hour=row['Hour'], Order_Count=row['Order Count']) for _, row in orders_by_hour.iterrows()]
         return result

