import styles from "./SpecList.module.scss";

import { attendToSpec } from "../actions/spec-api";

import spec1 from "../assets/images/spec1.png";
import spec2 from "../assets/images/spec2.png";
import spec3 from "../assets/images/spec3.png";
import spec4 from "../assets/images/spec4.png";
import spec5 from "../assets/images/spec5.png";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

import "swiper/css/pagination";
import "swiper/css";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

import blank from "../assets/images/blank.jpg";
import { setBlank } from "../actions/user-api";

const data = [
    {
        img: spec1,
        name: "Олег Савин",
        work: `Мастер спорта и диетолог "Квалифицированный
персональный тренер, диетолог. Мастер спорта по жиму
лежа Призер Чемпионата Европы"`,
    },
    {
        img: spec2,
        name: "Максим Залежаев",
        work: `Премия "Золотой Листок" за инновационные
        исследования в области диетотерапии. Награда
        "Жемчужина Здоровья" за помощь в улучшении здоровья
        и благополучия пациентов.`,
    },
    {
        img: spec3,
        name: "Зарина Лебедева",
        work: `Профессиональный диетолог. Помогает клиентам достичь
        своих фитнес-целей, применяя персональные тренировки
        и оптимальные питательные рекомендации.`,
    },
    {
        img: spec4,
        name: "Измайлов Александр",
        work: `Мастер спорта и диетолог "Квалифицированный
персональный тренер, диетолог. Мастер спорта по жиму
лежа Призер Чемпионата Европы"`,
    },
    {
        img: spec5,
        name: "Сергеев Денис",
        work: `Мастер спорта и диетолог "Квалифицированный
персональный тренер, диетолог. Мастер спорта по жиму
лежа Призер Чемпионата Европы"`,
    },
];

const SpecList = ({ isButtons = false }) => {
    const user = useSelector((state) => state.auth);
    const [isShowModal, setIsShowModal] = useState(false);
    const dispatch = useDispatch();

    const [currSpecId, setCurrSpecId] = useState(0);

    const modalRef = useRef();

    useEffect(() => {
        if (modalRef.current) {
            if (isShowModal) {
                modalRef.current.style.opacity = 1;
                modalRef.current.style.zIndex = 20;
            } else {
                modalRef.current.style.opacity = 0;
                setTimeout(() => {
                    modalRef.current.style.zIndex = -20;
                }, 500);
            }
        }
    }, [modalRef, isShowModal]);

    const attachFile = (userId) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf";

        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file.name.slice("-3") !== "pdf") {
                alert("Вы прикрепили не .pdf!");
                return;
            }
            // Здесь нужно сохранить информацию о прикрепленном файле в базу данных вместе с идентификатором пользователя
            dispatch(setBlank(file, file.name, userId)).then((data) => {
                if (data.status === "success") {
                    setIsShowModal(false);
                    dispatch(attendToSpec(currSpecId));
                    setTimeout(() => {
                        window.location.reload();
                    }, 300);
                } else {
                    alert("Произошла ошибка при загрузке файла!");
                }
            });
        });

        input.click();

        // Отображаем список уже загруженных файлов для пользователя
    };

    return (
        <div className={styles.container}>
            <div
                onClick={(e) =>
                    e.target === e.currentTarget && setIsShowModal(false)
                }
                ref={modalRef}
                className={styles.modal}>
                <div className={styles.modalBody}>
                    <div className={styles.download}>
                        <p className={styles.header}>
                            Скачайте медицинский бланк:
                        </p>
                        <img
                            src={blank}
                            alt="blank"
                        />

                        <a
                            href={blank}
                            download={true}>
                            Скачать файл
                        </a>
                    </div>
                    <div className={styles.upload}>
                        <p>Загрузите заполненный бланк: (формат: .pdf)</p>
                        <button onClick={() => attachFile(user.currentUser.id)}>
                            Загрузить файл
                        </button>
                    </div>
                </div>
            </div>
            <div className="info3">
                <p className="header">Наши специалисты</p>
                <div>
                    <div className="list2">
                        <Swiper
                            onSlideChange={(swiper) =>
                                setCurrSpecId(swiper.activeIndex)
                            }
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            className={styles.swiper}>
                            {data.map((item, ind) => {
                                return (
                                    <SwiperSlide
                                        key={ind}
                                        className={styles.slide}>
                                        <div
                                            key={ind}
                                            className="item">
                                            <img
                                                src={item.img}
                                                alt="spec"
                                            />
                                            <p className="head">Имя</p>
                                            <p className="text">{item.name}</p>
                                            <p className="head">Опыт работы</p>
                                            <p className="text">{item.work}</p>
                                            {isButtons &&
                                                (user.currentUser.spec_id !==
                                                null ? (
                                                    user.currentUser.spec_id ===
                                                    ind ? (
                                                        <p
                                                            className={
                                                                styles.already
                                                            }>
                                                            Вы уже записаны к
                                                            этому специалисту!
                                                        </p>
                                                    ) : (
                                                        <p
                                                            className={
                                                                styles.already
                                                            }>
                                                            Вы уже записаны к
                                                            другому специалисту!
                                                        </p>
                                                    )
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                setIsShowModal(
                                                                    true
                                                                )
                                                            }
                                                            className={
                                                                styles.button
                                                            }>
                                                            Записаться
                                                        </button>
                                                    </>
                                                ))}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecList;
