import React from 'react'
import { Suspense } from 'react'
import DetailClient from './_client'

function page() {
    return (
        <Suspense>
            <DetailClient />
        </Suspense>
    )
}

export default page