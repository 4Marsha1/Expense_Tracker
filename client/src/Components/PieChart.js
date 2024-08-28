import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

export default function BasicPie({ data }) {
    return (
        <PieChart
            series={[
                {
                    data,
                    arcLabel: (item) => item && `₹${item?.value}`,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
            ]}
            width={500}
            height={250}
            sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                }
            }}

        />
    );
}
