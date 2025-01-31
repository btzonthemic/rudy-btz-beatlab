import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Beat {
  id: string;
  title: string;
  genres?: { name: string };
  bpm?: number;
  key?: string;
  price: number;
}

interface BeatsTableProps {
  beats?: Beat[];
}

export function BeatsTable({ beats }: BeatsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead>BPM</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {beats?.map((beat) => (
          <TableRow key={beat.id}>
            <TableCell>{beat.title}</TableCell>
            <TableCell>{beat.genres?.name || 'Uncategorized'}</TableCell>
            <TableCell>{beat.bpm || '-'}</TableCell>
            <TableCell>{beat.key || '-'}</TableCell>
            <TableCell>${beat.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}