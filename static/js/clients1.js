$(document).ready(function () {


    $(".button_send").click(function () {
        if (
            (!$(".whom_all").is(":checked")) &&
            (!$(".whom_new").is(":checked"))
        ) {
            sweetAlert("Ошибка", "Вы не выбрали кому отправлять", "error");
            return;
        }

        if (
            (!$(".send_now").is(":checked")) &&
            (!$(".send_date").is(":checked"))
        ) {
            sweetAlert("Ошибка", "Вы не выбрали время доставки", "error");
            return;
        }

        if (
            ($("#send_sms").attr("checked") !== "checked") &&
            ($("#send_email").attr("checked") !== "checked")
        ) {
            sweetAlert("Ошибка", "Вы не выбрали способ доставки", "error");
            return;
        }

        if ($("#send_sms").attr("checked") === "checked") {
            var text1 = $(".sms_uv").val();
            if (text1.search('%@') == -1) {
                sweetAlert("Ошибка",
                    "В тексте рассылки по смс отсутствует параметр %@",
                    "error");
                return;
            } else {
                text1 = text1.replace('%@', ' %@ ').replace('  ', ' ').trim();
                if (text1.length > 37) {
                    sweetAlert(
                        "Ошибка",
                        "Количество символов в тексте уведомления превышает " +
                        "допустимо кол-во символов в одном смс. Текст одного " +
                        "смс не может быть более 70-ти символов, включая 32-х " +
                        "отведенных под ссылку на карту. Вы указали на " +
                        (text1.length - 37) + " символа больше.",
                        "error");
                    return;
                }
                $(".sms_uv").val(text1)
            }
        }
        if ($("#send_email").attr("checked") === "checked") {
            var text2 = $(".email_uv").val();
            if (text2.search('%@') == -1) {
                sweetAlert(
                    "Ошибка",
                    "В тексте рассылке по email отсутствует параметр %@",
                    "error");
                return;
            } else {
                text2 = text2.replace('%@', ' %@ ').replace('  ', ' ').trim();
                $(".email_uv").val(text2)
            }

        }

        make_mass_send();
        sweetAlert("Успешно", "Рассылка началась", "success");
    });

    jQuery('.date_picker').datetimepicker({
        format: 'd.m.Y H:i',
        lang: 'ru',
        minDate: 0,
        minTime: 0
    });

    $(".date").keypress(function (event) {
        event.preventDefault();
    });
});