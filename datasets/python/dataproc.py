import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# FastAPI app
app = FastAPI()

# CORS middleware to allow frontend to fetch data from this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins; in production, you can restrict it to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model to return to frontend
class OrderData(BaseModel):
    Hour: int
    Order_Count: int

# Function to get the correct CSV file based on the requested month and year
def get_csv_filename(month: str, year: str) -> str:
    folder_path = "/Users/roshankosaraju/Desktop/datathon/datasets/Roni_s Challenge public/Provided Data [FINAL]"  # Replace this with your folder path
    filename = f"{month.lower()}_{year}.csv"
    filepath = os.path.join(folder_path, filename)

    # Check if file exists
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"CSV file for {month} {year} not found.")
    
    return filepath

# Endpoint to get orders by hour for a specific month and year
@app.get("/api/orders-by-hour", response_model=List[OrderData])
async def get_orders_by_hour(month: str, year: str):
    try:
        # Get the CSV file for the requested month and year
        filepath = get_csv_filename(month, year)
        df = pd.read_csv(filepath)
        
        # Process the data for the given month
        df['Sent Date'] = pd.to_datetime(df["Sent Date"])
        df['Hour'] = df['Sent Date'].dt.hour
        orders_by_hour = df.groupby('Hour').size().reset_index(name='Order Count')

        # Prepare the result for frontend
        result = [OrderData(Hour=row['Hour'], Order_Count=row['Order Count']) for _, row in orders_by_hour.iterrows()]
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

# Endpoint to get cumulative least and most bought items for a specific month and year
@app.get("/api/cumulative_least_most_bought_item")
async def cumulative_least_most_bought_item(month: str, year: str):
    try:
        # Get the CSV file for the requested month and year
        filepath = get_csv_filename(month, year)
        df = pd.read_csv(filepath)
        
        # Process the data for the given month
        item_counts = df.groupby(['Sent Date', 'Parent Menu Selection'])['Order ID'].count().reset_index(name='Item_Count')
        item_counts['Cumulative_Item_Count'] = item_counts.groupby('Parent Menu Selection')['Item_Count'].cumsum()

        most_bought_item = item_counts.loc[item_counts['Cumulative_Item_Count'].idxmax()]
        least_bought_item = item_counts.loc[item_counts['Cumulative_Item_Count'].idxmin()]

        return {
            "most_bought_item": most_bought_item.to_dict(),
            "least_bought_item": least_bought_item.to_dict(),
        }
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

# Endpoint to get cumulative percentage of customers for a specific month and year
@app.get("/api/cumulative_percentage_of_customers")
async def cumulative_percentage_of_customers(month: str, year: str):
    try:
        # Get the CSV file for the requested month and year
        filepath = get_csv_filename(month, year)
        df = pd.read_csv(filepath)
        
        # Process the data for the given month
        df['Date'] = pd.to_datetime(df['Sent Date']).dt.date
        df['Hour'] = df['Sent Date'].dt.hour
        hourly_customers = df.groupby(['Date', 'Hour'])['Order ID'].nunique().reset_index(name='Customers')
        daily_customers = df.groupby('Date')['Order ID'].nunique().reset_index(name='Total_Customers')

        df_merged = pd.merge(hourly_customers, daily_customers, on='Date')
        df_merged['Customer_Percentage'] = df_merged['Customers'] / df_merged['Total_Customers'] * 100
        df_merged['Cumulative_Percentage'] = df_merged.groupby('Date')['Customer_Percentage'].cumsum()

        return df_merged.to_dict(orient="records")
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
