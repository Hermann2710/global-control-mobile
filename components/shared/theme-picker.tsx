import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Laptop, Monitor, Moon, Sun } from 'lucide-react-native'; // Import Lucide
import { useColorScheme } from 'nativewind';
import * as React from 'react';

export function ThemeToggle() {
    const { colorScheme, setColorScheme } = useColorScheme();

    // Fonction pour l'icône principale du bouton
    const HeaderIcon = () => {
        if (colorScheme === 'light') return <Sun size={24} className="text-foreground" />;
        if (colorScheme === 'dark') return <Moon size={24} className="text-foreground" />;
        return <Laptop size={24} className="text-foreground" />; // Icône pour le mode système
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                    <HeaderIcon />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-14 min-w-[56px] items-center'>
                <DropdownMenuItem
                    onPress={() => setColorScheme('light')}
                    className='justify-center py-3'
                >
                    <Sun size={20} className="text-foreground" />
                </DropdownMenuItem>

                <DropdownMenuItem
                    onPress={() => setColorScheme('dark')}
                    className='justify-center py-3'
                >
                    <Moon size={20} className="text-foreground" />
                </DropdownMenuItem>

                <DropdownMenuItem
                    onPress={() => setColorScheme('system')}
                    className='justify-center py-3'
                >
                    <Monitor size={20} className="text-foreground" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}