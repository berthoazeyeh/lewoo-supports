import { combineReducers } from 'redux';
import { ThemeReducer } from './ThemeReducer';
import { UserReducer } from './UserReducer';
import { TranslationReducer } from './TranslationReducer';
import { SynchroisationReducer } from './SynchroisationReducer';

const RootReducer = combineReducers({
    translation: TranslationReducer, // Ajoutez le reducer de traduction ici
    theme: ThemeReducer,
    user: UserReducer,
    sync: SynchroisationReducer,
});

export default RootReducer
