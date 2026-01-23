import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { View } from 'react-native';

interface FormSectionProps {
    value: string;
    title: string;
    iconName?: React.ComponentProps<typeof Ionicons>['name'];
    children: React.ReactNode;
}

export function FormSection({ value, title, iconName, children }: FormSectionProps) {
    return (
        <AccordionItem value={value} className='border-b border-border'>
            <AccordionTrigger>
                <View className='flex-row items-center gap-3'>
                    {iconName && (
                        <Ionicons name={iconName} size={20} className='text-muted-foreground' />
                    )}
                    <Text className='text-lg font-semibold'>{title}</Text>
                </View>
            </AccordionTrigger>
            <AccordionContent>
                <View className='pb-6 pt-2 gap-4 px-1'>
                    {children}
                </View>
            </AccordionContent>
        </AccordionItem>
    );
}