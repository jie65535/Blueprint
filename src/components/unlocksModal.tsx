import { useCardStore } from "../modules/state/store.ts";
import { Button, Container, Group, Modal, SimpleGrid, Switch } from "@mantine/core";
import { options } from "../modules/const.ts";
import { translateGameName } from "../modules/i18n/gameTranslations.ts";

export default function UnlocksModal() {
    const selectOptionsModalOpen = useCardStore(state => state.applicationState.selectOptionsModalOpen);
    const closeSelectOptionModal = useCardStore(state => state.closeSelectOptionModal);
    const selectedOptions = useCardStore(state => state.immolateState.selectedOptions);
    const setSelectedOptions = useCardStore(state => state.setSelectedOptions);
    if (!selectOptionsModalOpen) return null;
    return (
        <Modal size="auto" title={'解锁'} opened={selectOptionsModalOpen} onClose={() => closeSelectOptionModal()}>
            <Container fluid>
                <Switch.Group
                    defaultValue={options}
                    label="已解锁项目"
                    description="您在游戏中解锁的项目"
                    withAsterisk
                    value={selectedOptions}
                    onChange={setSelectedOptions}
                >
                    <SimpleGrid cols={{ base: 2, md: 4, lg: 6 }} mb={'lg'} mt={'xs'}>
                        {
                            options.map((option: string, i: number) => (
                                <Switch key={i} value={option} label={translateGameName(option)} />))
                        }
                    </SimpleGrid>
                </Switch.Group>
                <Group justify={'flex-end'}>
                    <Button onClick={() => setSelectedOptions(options)}>全选</Button>
                    <Button onClick={() => setSelectedOptions([])}>全部移除</Button>
                </Group>
            </Container>
        </Modal>
    )
}
