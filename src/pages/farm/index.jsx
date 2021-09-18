import { Wrap } from '../../components/ReusableStyles'

import { ChainId } from '@soulswap/sdk'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'

import { FarmList } from '../../features/farm/Farms'

export default function Farm() {
  return (
    <Wrap width="50%" justifyContent="center">
      <Container id="farm-page" className="block h-full grid-cols-4 py-4 mx-auto md:py-8 lg:py-12 gap-9" maxWidth="7xl">
        <Head>
          <title>Farm | Soul</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>

        <FarmList />
      </Container>
    </Wrap>
  )
}