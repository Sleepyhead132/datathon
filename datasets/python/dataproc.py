import pandas as pd
import matplotlib as plt
import seaborn as sns

df=pd.read_csv("/Users/roshankosaraju/Desktop/datathon/datasets/Roni_s Challenge public/Provided Data [FINAL]/april_2024.csv")



df['Sent Date']= pd.to_datetime(df["Sent Date"])
buy_freq= df["Parent Menu Selection"].value_counts()
orders_by_date = df.groupby([df['Sent Date'].dt.date, 'Parent Menu Selection']).size().reset_index(name='Order Count')
df['Hour'] = df['Sent Date'].dt.hour
orders_by_hour = df.groupby(['Hour', 'Parent Menu Selection']).size().reset_index(name='Order Count')

def perhour():
        # Extract hour from Sent Date
        df['Hour'] = df['Sent Date'].dt.hour
        orders_by_hour = df.groupby('Hour').size().reset_index(name='Order Count')
        x_values = orders_by_hour['Hour']  # x-values (hours)
        y_values = orders_by_hour['Order Count']  # y-values (order counts)
        
        # Output the data points
        data_points = list(zip(x_values, y_values))
        return data_points
