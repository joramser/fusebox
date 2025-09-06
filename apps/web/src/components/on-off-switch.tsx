import { PowerIcon } from "@phosphor-icons/react";
import { Switch } from "@web/components/ui/switch";

export type OnOffSwitchProps = {
  checked: boolean;
};

export const OnOffSwitch = (props: React.ComponentProps<typeof Switch>) => {
  return (
    <div className="relative h-7 flex items-center text-sm font-medium">
      <Switch
        className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        {...props}
      />
      <span className="pointer-events-none relative ms-0.5 flex w-6 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
        <PowerIcon size={14} aria-hidden="true" />
      </span>
      <span className="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex w-6 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
        <PowerIcon size={14} aria-hidden="true" />
      </span>
    </div>
  );
};
