import { useActiveViewport } from "@itwin/appui-react";
import { Id64Array } from "@itwin/core-bentley";
import { Button } from "@itwin/itwinui-react";

export interface BuildingGroup {
    name: string;
    buildings: Id64Array;
  }

  export interface GroupListItemProps {
    item: BuildingGroup;
    handleItemChange: (oldItem: BuildingGroup, newItem: BuildingGroup) => void;
  }

  export const BuildingGroupListItem: React.FC<GroupListItemProps> = ({
    item,
    handleItemChange,
  }: GroupListItemProps) => {
    const viewport = useActiveViewport();

    const savebuilding = async () => {
        if (viewport?.iModel.selectionSet.isActive) { // If something is selected
          const newSelectedBuildings = {name: item.name, buildings:[...item.buildings, ...viewport.iModel.selectionSet.elements]}; 
          handleItemChange(item, newSelectedBuildings);  // Save the new selection to the sate
        }
      }
      
      const saveSelectedBuildings = async () => {
        if (viewport) {
          viewport.iModel.selectionSet.emptyAll();
          viewport.iModel.selectionSet.add(item.buildings);
        }
      }

      const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, name: e.target.value};
        handleItemChange(item, newItem);
      }
  
    return (
      <div>
        {item.buildings.length}
        <input type="text" value={item.name} onChange={onNameChange} />
        <Button onClick={savebuilding}>Save Selected Building</Button>
        <Button onClick={saveSelectedBuildings}>Select Saved Buildings</Button>
      </div>
    )
  }