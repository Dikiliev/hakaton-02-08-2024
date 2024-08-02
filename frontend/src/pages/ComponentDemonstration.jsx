import {useAuthStore} from "@/store/auth";
import {Container} from "@components/common/layouts/Layouts.jsx";
import Strap from "@components/common/strap/Strap.jsx";
import {Button, OutlineButton} from "@components/common/button/Button.jsx";
import {FieldsGroup} from "@components/layout/fieldsGroup/FieldGroup.jsx";
import {Input} from "@components/common/input/Input.jsx";
import {Text} from "@components/common/textes/Text.jsx";
import SecondaryText from "@components/common/textes/SecondaryText.jsx";
import {HorizontalLine} from "@components/common/horizontalLine/HorizontalLine.jsx";
import {Dropdown, DropdownOption} from "@components/common/dropdown/Dropdown.jsx";
import {FileUploader} from "@components/common/fileUploader/FileUploader.jsx";

function MainPage() {
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    return (
        <Container>
            <Strap>
                {isLoggedIn() ? (
                    <h1>Welcome {user().username}</h1>
                ) : (
                    <h1>Welcome, Guest!</h1>
                )}

                <h3>Кнопки:</h3>
                <Button>Standard Button</Button>
                <OutlineButton>Outline Button</OutlineButton>

                <Strap reverse={true}>
                    <OutlineButton reverse={true}>Outline Button Revers</OutlineButton>
                </Strap>

                <FieldsGroup center={false}>
                    <Button>First Button</Button>
                    <Button>Second Button</Button>
                    <Button>Third Button</Button>
                </FieldsGroup>

                <h3>Поля ввода:</h3>
                <Input placeholder={'Username'}></Input>

                <FieldsGroup>
                    <Input placeholder={'First Name'}></Input>
                    <Input placeholder={'Last Name'}></Input>
                </FieldsGroup>

                <h3>Текста:</h3>
                <h1>Text h1</h1>
                <h2>Text h2</h2>
                <h3>Text h3</h3>
                <h4>Text h4</h4>
                <Text>Standard Text</Text>
                <SecondaryText>Secondary Text</SecondaryText>

                <h3>Линии:</h3>
                <HorizontalLine/>
                <HorizontalLine dashed={true}/>

                <h3>Дропбоксы:</h3>
                <Dropdown placeholder={'Ваш любимый интсрумент'}>
                    <DropdownOption value={'React JS'}></DropdownOption>
                    <DropdownOption value={'React Native'}></DropdownOption>
                    <DropdownOption value={'Django Rest Framework'}></DropdownOption>
                    <DropdownOption value={'Koklin'}></DropdownOption>
                    <DropdownOption value={'Spring'}></DropdownOption>
                    <DropdownOption value={'DotNet'}></DropdownOption>
                </Dropdown>

                <FieldsGroup>
                    <Dropdown placeholder={'Ваш интсрумент фронтенду'}>
                        <DropdownOption value={'React JS'}></DropdownOption>
                        <DropdownOption value={'React Native'}></DropdownOption>
                        <DropdownOption value={'Koklin'}></DropdownOption>
                    </Dropdown>
                    <Dropdown placeholder={'Ваш интсрумент по бэкенду'}>
                        <DropdownOption value={'Django Rest Framework'}></DropdownOption>
                        <DropdownOption value={'Spring'}></DropdownOption>
                        <DropdownOption value={'DotNet'}></DropdownOption>
                    </Dropdown>
                    <Dropdown placeholder={'Ваша любимый интсрумент с работы данными'}>
                        <DropdownOption value={'SQLite'}></DropdownOption>
                        <DropdownOption value={'MongoDB'}></DropdownOption>
                        <DropdownOption value={'PostgreSQL'}></DropdownOption>
                    </Dropdown>
                </FieldsGroup>

                <h3>Загрузка фотографии с показом:</h3>
                <FileUploader></FileUploader>

                <Strap></Strap>
                <Strap></Strap>
                <Strap reverse={true}></Strap>
                <Strap reverse={true}></Strap>

            </Strap>
        </Container>
    );
}

export default MainPage;
