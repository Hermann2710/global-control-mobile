import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Monitor, Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';

export function ThemeToggle() {
    const { colorScheme, setColorScheme } = useColorScheme();

    // Définition des couleurs en "dur" pour garantir l'affichage
    // Remplacez ces codes hexadécimaux par ceux de votre charte graphique
    const iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                    {colorScheme === 'light' ? (
                        <Sun size={24} color={iconColor} />
                    ) : colorScheme === 'dark' ? (
                        <Moon size={24} color={iconColor} />
                    ) : (
                        <Monitor size={24} color={iconColor} />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-16 min-w-[64px] items-center'>
                <DropdownMenuItem
                    onPress={() => setColorScheme('light')}
                    className='justify-center py-4'
                >
                    <Sun size={24} color={iconColor} />
                </DropdownMenuItem>

                <DropdownMenuItem
                    onPress={() => setColorScheme('dark')}
                    className='justify-center py-4'
                >
                    <Moon size={24} color={iconColor} />
                </DropdownMenuItem>

                <DropdownMenuItem
                    onPress={() => setColorScheme('system')}
                    className='justify-center py-4'
                >
                    <Monitor size={24} color={iconColor} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}