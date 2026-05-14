import React from "react";
import {
    Anchor,
    AppShell,
    Button,
    Center, Divider,
    Flex,
    HoverCard,
    HoverCardDropdown,
    HoverCardTarget,
    Text, Title
} from "@mantine/core";
import {IconCoffee, IconHeart} from "@tabler/icons-react";
import {useQuery} from "@tanstack/react-query";
import ShinyText from "../../shinyText/shinyText.tsx";
import {GaEvent} from "../../../modules/useGA.ts";


export default function Footer() {
    const {data: supporters, isPending: isPending} = useQuery<Array<{ name: string, subscription: boolean }>>({
        queryKey: ['supporters'],
        queryFn: async () => {
            const response = await fetch('https://ttyyetpmvt.a.pinggy.link/supporters', {
                method: 'POST',
            });
            if (!response.ok) {
                console.error(response);
                return [{name: 'pifreak', subscription: true}]
            }
            return response.json();
        }
    })
    return (
        <AppShell.Footer p={'xs'}>
            <Center w={'100%'}>
                <Flex align={'center'} direction={{base: "column", sm: "row"}} gap={'sm'}>
                    <Text ta={'center'} fz={'xs'}>
                        由 Michael Walker 使用{' '}
                        <Anchor fz={'xs'} href={"https://mantine.dev/"} target={"_blank"}>Mantine</Anchor>、
                        <Anchor fz={'xs'} href={'https://vite.dev/'}>Vite</Anchor>、
                        <Anchor fz={'xs'} href={'https://github.com/pmndrs/zustand'}>Zustand</Anchor>、
                        <Anchor fz={'xs'} href={'https://github.com/MathIsFun0/Immolate'}>Immolate</Anchor> 制作。
                        简体中文翻译由 <Anchor fz={'xs'} href={'https://github.com/jie65535'} target={'_blank'}>jie65535</Anchor> 提供。
                    </Text>
                    <Button
                        component={'a'}
                        target={'_blank'}
                        href={'https://buymeacoffee.com/ouisihai2'}
                        size={'compact-sm'}
                        color={'yellow'}
                        leftSection={<IconCoffee/>}
                    >
                        请我喝杯咖啡
                    </Button>
                    <HoverCard onOpen={() => GaEvent('view_supporters')}>
                        <HoverCardTarget>
                            <Text ta={'center'} fz={'xs'}>
                                <IconHeart size={'11'}/> 咖啡买家
                            </Text>
                        </HoverCardTarget>
                        <HoverCardDropdown w={'100%'} maw={400}>
                            <Title order={4}>咖啡买家</Title>
                            {
                                !isPending &&
                                supporters?.length &&
                                supporters.length > 0 && (
                                    <>
                                        <Text fz={'xs'} c={'dimmed'}>
                                            这些热心人为我买了一杯咖啡来支持我的工作，并激励我不断改进 Blueprint！：
                                        </Text>
                                        <Divider mb={'sm'}/>
                                    </>
                                )
                            }
                            {
                                supporters?.length ?
                                    supporters
                                        .sort((a, b) => {
                                            if (a.subscription && !b.subscription) return -1;
                                            if (!a.subscription && b.subscription) return 1;
                                            return 0;
                                        })
                                        .map((s, i) => {
                                            if (s.subscription) {
                                                return <Text key={i} fz={'sm'}><ShinyText text={s.name}
                                                                                          speed={3}/></Text>
                                            } else {
                                                return <Text key={i} fz={'sm'}>{s.name}</Text>
                                            }
                                        })
                                    : <Text fz={'xs'}>暂无支持者</Text>}
                            <Divider my={'sm'}/>
                            <Text fz={'xs'} c={'dimmed'}>
                                如果您最近请我喝了咖啡但没看到您的名字，请等待约5分钟后刷新。
                            </Text>
                        </HoverCardDropdown>
                    </HoverCard>
                </Flex>

            </Center>

        </AppShell.Footer>
    )
}
