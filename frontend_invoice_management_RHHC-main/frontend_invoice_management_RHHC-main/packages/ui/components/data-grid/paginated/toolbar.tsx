import { TextField } from '@mui/material';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type FC,
  type ReactNode,
} from 'react';
import { FlexBox } from '../../../elements';

interface ToolbarContainerProps {
  children: ReactNode;
  rows?: any;
  currencyType?: string;
  defaultCurrencyCode?: string;
  accountCurrencyCode?: string;
}

export type ToolbarContainer<T = {}> = FC<ToolbarContainerProps & T>;

export interface ToolbarProps {
  label?: string;

  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  container?: ToolbarContainer;
}

const DefaultToolbarContainer: ToolbarContainer = ({ children }) => {
  return (
    <FlexBox justify="flex-end" sx={{ px: 4, mb: 4 }}>
      {children}
    </FlexBox>
  );
};

const Toolbar = ({
  onChange,
  label = 'Search from data',
  container: Container = DefaultToolbarContainer,
  value,
}: ToolbarProps) => {
  const [searchValue, setSearchValue] = useState(value ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchValue) {
      inputRef.current?.focus();
    }
  }, [onChange]);

  return (
    <Container>
      <TextField
        inputRef={inputRef}
        label={label}
        onChange={(e) => {
          setSearchValue(e.target.value);
          onChange(e);
        }}
        size="small"
        sx={{
          minWidth: {
            md: 200,
          },
          maxWidth: {
            xs: 150,
            md: 200,
          },
        }}
        value={searchValue}
      />
    </Container>
  );
};

export default Toolbar;
