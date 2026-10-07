import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AssistantState {
  voiceEnrolled: boolean;
  lastSynthesisAt: number | null;
}

const initialState: AssistantState = {
  voiceEnrolled: false,
  lastSynthesisAt: null,
};

const assistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    setVoiceEnrolled(state, action: PayloadAction<boolean>) {
      state.voiceEnrolled = action.payload;
    },
    markSynthesis(state) {
      state.lastSynthesisAt = Date.now();
    },
  },
});

export const { setVoiceEnrolled, markSynthesis } = assistantSlice.actions;
export default assistantSlice.reducer;
