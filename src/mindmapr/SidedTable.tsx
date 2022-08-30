import {FC, ReactNode} from 'react';
import styled from 'styled-components';

interface SidedTableProps{
    side: 'left' | 'right'
    children?: ReactNode
}

export const SidedTable: FC<SidedTableProps> = ({side, children})=> {
    if(side === 'left'){
        return <LeftTable>{children}</LeftTable>
    }
    return <RightTable>{children}</RightTable>
}

const LeftTable = styled.table `
    display: flex;
    justify-content: flex-end;
`;

const RightTable = styled.table `
    display: flex;
    justify-content: flex-start;`
;