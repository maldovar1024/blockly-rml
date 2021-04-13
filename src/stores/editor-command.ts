import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { CreateBlockPayload, EditorCommandStore } from './types';

const initialState: EditorCommandStore = {
  id: '',
  filename: '',
  reference: '',
};

const editorCommand = createSlice({
  name: 'editorCommands',
  initialState,
  reducers: {
    createBlock(store, action: PayloadAction<CreateBlockPayload>) {
      Object.assign<typeof store, EditorCommandStore>(store, {
        id: nanoid(),
        ...action.payload,
      });
    },
  },
});

export default editorCommand;
