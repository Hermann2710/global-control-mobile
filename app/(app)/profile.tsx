import ProfileScreen from '@/components/main/profile-screen'
import CircleBackground from '@/components/shared/circle-background'
import { DismissKeyboard } from '@/components/shared/dismiss-keyboard'
import { useAuth } from '@/contexts/auth-context'
import React from 'react'

export default function Profile() {
    const { user } = useAuth()
    return (
        <CircleBackground>
            <DismissKeyboard withSafeArea={false}>
                <ProfileScreen user={user} />
            </DismissKeyboard>
        </CircleBackground>
    )
}