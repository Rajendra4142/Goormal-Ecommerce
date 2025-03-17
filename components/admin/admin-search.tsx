"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Determine the base URL for search
    const baseUrl = pathname.includes('/admin/orders')
        ? '/admin/orders'
        : pathname.includes('/admin/users')
            ? '/admin/users'
            : '/admin/products';

    // Track query value
    const [queryValue, setQueryValue] = useState('');

    // Update query value when searchParams change
    useEffect(() => {
        const query = searchParams.get('query') || '';
        setQueryValue(query);
    }, [searchParams]);

    // Debounce search input and update URL
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (queryValue) {
                params.set('query', queryValue);
            } else {
                params.delete('query');
            }
            router.replace(`${baseUrl}?${params.toString()}`);
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [queryValue, baseUrl, router, searchParams]);

    return (
        <div>
            <Input
                type="search"
                placeholder="Search..."
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                className="md:w-[100px] lg:w-[300px]"
                aria-label="Search"
            />
        </div>
    );
};

export default AdminSearch;