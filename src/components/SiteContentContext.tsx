import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSiteContent } from '@/lib/supabase';

interface SiteContentContextType {
    content: Record<string, string>;
    loading: boolean;
    getContent: (key: string, fallback: string) => string;
    refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType>({
    content: {},
    loading: true,
    getContent: (_, fallback) => fallback,
    refreshContent: async () => { },
});

export const useSiteContent = () => useContext(SiteContentContext);

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const data = await getSiteContent();
            setContent(data);
        } catch (err) {
            console.error('Failed to load site content:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const getContent = (key: string, fallback: string): string => {
        return content[key] || fallback;
    };

    return (
        <SiteContentContext.Provider value={{ content, loading, getContent, refreshContent: fetchContent }}>
            {children}
        </SiteContentContext.Provider>
    );
};
