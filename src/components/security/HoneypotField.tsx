import { Input } from '@/components/ui/input';

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const HoneypotField = ({ value, onChange }: HoneypotFieldProps) => {
  return (
    <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
      <Input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Please leave this field blank"
      />
    </div>
  );
};
