interface HasIdAndChildren {
  id: String | number;
  children: HasIdAndChildren[];
}

interface MindmaprProps<T extends HasIdAndChildren> {
  items: T;
  onChange: (data: T) => void;
}

export const Mindmapr = <T extends HasIdAndChildren>({
  items,
  onChange,
}: MindmaprProps<T>) => {
  return <div>uff</div>;
};
