import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/modules/auth/store";
import { usersReducer } from "@/modules/users/store";
import { conversationsReducer } from "@/modules/conversations/store";
import { faqsReducer } from "@/modules/faqs/store";
import { suggestionsReducer } from "@/modules/faqSuggestions/store";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    conversations: conversationsReducer,
    faqs: faqsReducer,
    suggestions: suggestionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/login/pending", "auth/login/fulfilled", "auth/login/rejected"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

