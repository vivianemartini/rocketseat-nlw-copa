import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { VStack, useToast, HStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { api } from '../services/api';

import { Option } from '../components/Option';
import { Header } from "../components/Header";
import { Loading } from '../components/Loading';
import { Guesses } from '../components/Guesses';
import { PoolHeader } from '../components/PoolHeader';
import { PoolCardPros } from '../components/PoolCard'
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';

interface RouteParams {
    id: string;
}

export function Details() {
    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
    const [isLoading, setIsLoading] = useState(true);
    const [poolDetails, setpoolDetails] = useState<PoolCardPros>({} as PoolCardPros);

    const toast = useToast();

    const route = useRoute();
    const { id } = route.params as RouteParams;

    async function fetchePoolDetails() {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}`);
            setpoolDetails(response.data.pool);

        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão.',
                placement: 'top',
                bgColor: 'red.500'
            })
            
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeShare(){
       await  Share.share({
            message: poolDetails.code
        });
    }

    useEffect (() => {
        fetchePoolDetails();
    },[id]);

    if(isLoading){
        return (
            <Loading />
        );
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={poolDetails.title} 
            showBackButton 
            showShareButton
            onShare={handleCodeShare}
            />

            {
                poolDetails._count?.participants > 0 ? 
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />

                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option 
                        title='Seus palpites' 
                        isSelected={optionSelected === 'guesses'}
                        onPress={() => setOptionSelected('guesses')}
                        />

                        <Option 
                        title='Ranking do grupo' 
                        isSelected={optionSelected === 'ranking'}
                        onPress={() => setOptionSelected('ranking')}/>
              
                    </HStack>
                <Guesses poolId={poolDetails.id} code={poolDetails.code} />

                </VStack>

                : <EmptyMyPoolList code={poolDetails.code} />
            }

        </VStack>
    );
}