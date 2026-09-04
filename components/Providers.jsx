"use client";

import { AppProvider } from "@/context/AppContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { CollectionsProvider } from "@/context/CollectionsContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { DiscountProvider } from "@/context/DiscountContext";
import { GiftMessageCardProvider } from "@/context/GiftMessageCardContext";
import { OrderProvider } from "@/context/OrderContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { Toaster } from "sonner";

export default function Providers({ children }) {
  return (
    <AppProvider>
      <CustomerProvider>
        <ProductsProvider>
          <CategoriesProvider>
            <CollectionsProvider>
              <DiscountProvider>
                <OrderProvider>
                  <GiftMessageCardProvider>
                    {children}

                    <Toaster
                      position="top-center"
                      richColors
                      toastOptions={{
                        style: {
                          fontFamily: "Jost, system-ui, sans-serif",
                          fontSize: "13px",
                          letterSpacing: "0.02em",
                        },
                        className: "sonner-toast",
                      }}
                    />
                  </GiftMessageCardProvider>
                </OrderProvider>
              </DiscountProvider>
            </CollectionsProvider>
          </CategoriesProvider>
        </ProductsProvider>
      </CustomerProvider>
    </AppProvider>
  );
}
