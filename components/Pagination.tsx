'use client';
import { Button } from './ui/button';

export default function Pagination() {
  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          {'<<'}
        </Button>
        <Button variant="outline" size="sm" disabled>
          {'<'}
        </Button>
        <Button size="sm" className="bg-blue-600 text-white">
          1
        </Button>
        <Button variant="outline" size="sm" disabled>
          {'>'}
        </Button>
        <Button variant="outline" size="sm" disabled>
          {'>>'}
        </Button>
      </div>
    </div>
  );
}
