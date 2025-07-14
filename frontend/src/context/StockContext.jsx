import React, { createContext, useState, useContext } from "react";

const StockContext = createContext();

export const StockProvider = (props) => {
    const [selectedStock, setSelectedStock] = useState(null);
    
    return (
        <StockContext.Provider value={{ selectedStock, setSelectedStock }}>
            {props.children}
        </StockContext.Provider>
    )
};

export const useStock = () => useContext(StockContext);