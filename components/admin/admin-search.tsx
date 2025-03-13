"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Determine the form action URL
    const formActionUrl = pathname.includes('/admin/orders')
        ? '/admin/orders'
        : pathname.includes('/admin/users')
            ? '/admin/users'
            : '/admin/products';

    // Track query value
    const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');

    useEffect(() => {
        const query = searchParams.get('query') || '';
        setQueryValue(query);
    }, [searchParams]);  // Use searchParams.toString() to trigger updates

    return (
        <form action={formActionUrl} method="GET">
            <Input
                type="search"
                placeholder="Search..."
                name="query"
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                className="md:w-[100px] lg:w-[300]"
            />
            <button className="sr-only" type="submit">Search</button>
        </form>
    );
};

export default AdminSearch;
