import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService){}

   async sendMail(to: string, link){
        await this.mailerService.sendMail({
            to,
            from: "Roman  && Company",
            subject:"Testing Nest MailerModule ✔",
            text: "to to to na na na",
            html: `<h2> there will be link </h2>
                    <a href="http://sinoptik.ua">${link}</a>`
        })
    }
}
