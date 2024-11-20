import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';

export default function HomeCard({
  title,
  children,
}: Readonly<{ title: string | JSX.Element; children: React.ReactNode }>) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
