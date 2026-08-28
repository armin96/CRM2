package com.minicrm;

import com.minicrm.auth.entity.User;
import com.minicrm.auth.repository.UserRepository;
import com.minicrm.contact.entity.Contact;
import com.minicrm.contact.repository.ContactRepository;
import com.minicrm.deal.entity.Deal;
import com.minicrm.deal.entity.Deal.DealStage;
import com.minicrm.deal.entity.Deal.Priority;
import com.minicrm.deal.repository.DealRepository;
import com.minicrm.email.entity.EmailLog;
import com.minicrm.email.entity.EmailLog.EmailStatus;
import com.minicrm.email.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final DealRepository dealRepository;
    private final EmailLogRepository emailLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("Seeding demo data...");

        // Create demo user
        User user = userRepository.save(User.builder()
            .email("demo@minicrm.io")
            .password(passwordEncoder.encode("demo1234"))
            .fullName("Alex Johnson")
            .build());

        // Create contacts
        Contact[] contacts = {
            contactRepository.save(Contact.builder().user(user)
                .firstName("Sarah").lastName("Chen").email("sarah.chen@techcorp.io")
                .phone("+1-415-555-0101").company("TechCorp").title("VP of Engineering")
                .source("LinkedIn").tags(new String[]{"hot-lead", "enterprise"})
                .notes("Met at React Summit. Very interested in the API tier.").build()),

            contactRepository.save(Contact.builder().user(user)
                .firstName("Marcus").lastName("Reed").email("mreed@growthly.com")
                .phone("+1-212-555-0182").company("Growthly").title("CEO")
                .source("Cold Outreach").tags(new String[]{"decision-maker", "startup"})
                .notes("Responded to 3rd follow-up email. Budget confirmed ~$40k/yr.").build()),

            contactRepository.save(Contact.builder().user(user)
                .firstName("Priya").lastName("Sharma").email("priya@scalenow.co")
                .phone("+1-650-555-0237").company("ScaleNow").title("Head of Product")
                .source("Referral").tags(new String[]{"warm-lead"})
                .notes("Referred by Marcus. Looking to replace Salesforce.").build()),

            contactRepository.save(Contact.builder().user(user)
                .firstName("Daniel").lastName("Torres").email("dtorres@launchpad.io")
                .phone("+1-310-555-0093").company("Launchpad.io").title("CTO")
                .source("Conference").tags(new String[]{"enterprise", "technical"})
                .notes("Deep technical requirements. Needs SOC2 compliance.").build()),

            contactRepository.save(Contact.builder().user(user)
                .firstName("Emma").lastName("Watson").email("emma.w@brightmedia.com")
                .phone("+1-617-555-0344").company("BrightMedia").title("Marketing Director")
                .source("Inbound").tags(new String[]{"smb", "warm-lead"})
                .notes("Downloaded whitepaper. Booked a demo call.").build()),

            contactRepository.save(Contact.builder().user(user)
                .firstName("Yuki").lastName("Nakamura").email("y.nakamura@finflow.jp")
                .phone("+81-3-5555-0156").company("FinFlow").title("COO")
                .source("LinkedIn").tags(new String[]{"international", "enterprise"})
                .notes("Expansion into APAC market. Evaluating multiple vendors.").build()),

            contactRepository.save(Contact.builder().user(user)
                .firstName("Carlos").lastName("Mendez").email("carlos@cloudpilot.dev")
                .phone("+34-91-555-0278").company("CloudPilot").title("Founder")
                .source("Cold Outreach").tags(new String[]{"startup", "technical"})
                .notes("Early-stage, bootstrapped. Very price-sensitive.").build()),

            contactRepository.save(Contact.builder().user(user)
                .firstName("Rachel").lastName("Kim").email("rkim@healthtech.ai")
                .phone("+1-404-555-0391").company("HealthTech AI").title("VP Sales")
                .source("Referral").tags(new String[]{"hot-lead", "healthcare"})
                .notes("HIPAA compliance is non-negotiable. Budget approved Q1.").build())
        };

        // Create deals
        Deal d1 = dealRepository.save(Deal.builder().user(user).contact(contacts[0])
            .title("TechCorp — API Integration Suite")
            .value(new BigDecimal("85000")).stage(DealStage.QUALIFIED)
            .priority(Priority.HIGH).position(0)
            .expectedCloseDate(LocalDate.now().plusDays(30))
            .notes("POC completed. Legal review in progress.").build());

        Deal d2 = dealRepository.save(Deal.builder().user(user).contact(contacts[1])
            .title("Growthly — CRM Starter Plan")
            .value(new BigDecimal("24000")).stage(DealStage.PROPOSAL)
            .priority(Priority.HIGH).position(0)
            .expectedCloseDate(LocalDate.now().plusDays(14))
            .notes("Proposal sent. Waiting for board approval.").build());

        Deal d3 = dealRepository.save(Deal.builder().user(user).contact(contacts[2])
            .title("ScaleNow — Enterprise License")
            .value(new BigDecimal("120000")).stage(DealStage.CONTACTED)
            .priority(Priority.MEDIUM).position(0)
            .expectedCloseDate(LocalDate.now().plusDays(60))
            .notes("Discovery call done. Sending SOW next week.").build());

        Deal d4 = dealRepository.save(Deal.builder().user(user).contact(contacts[3])
            .title("Launchpad — Security Package")
            .value(new BigDecimal("45000")).stage(DealStage.LEAD)
            .priority(Priority.MEDIUM).position(0)
            .expectedCloseDate(LocalDate.now().plusDays(90))
            .notes("Initial contact made. SOC2 docs requested.").build());

        Deal d5 = dealRepository.save(Deal.builder().user(user).contact(contacts[7])
            .title("HealthTech AI — Compliance Module")
            .value(new BigDecimal("95000")).stage(DealStage.WON)
            .priority(Priority.HIGH).position(0)
            .expectedCloseDate(LocalDate.now().minusDays(5))
            .notes("Contract signed! Implementation starts next Monday.").build());

        Deal d6 = dealRepository.save(Deal.builder().user(user).contact(contacts[6])
            .title("CloudPilot — Startup Plan")
            .value(new BigDecimal("8400")).stage(DealStage.LOST)
            .priority(Priority.LOW).position(0)
            .expectedCloseDate(LocalDate.now().minusDays(10))
            .notes("Went with a competitor due to pricing.").build());

        // Create email logs
        emailLogRepository.save(EmailLog.builder().user(user).contact(contacts[0]).deal(d1)
            .subject("Following up on our API integration discussion")
            .bodyPreview("Hi Sarah, great speaking with you at React Summit! I wanted to follow up on the API integration details we discussed...")
            .status(EmailStatus.REPLIED).sentAt(LocalDateTime.now().minusDays(5))
            .openedAt(LocalDateTime.now().minusDays(4)).repliedAt(LocalDateTime.now().minusDays(3)).build());

        emailLogRepository.save(EmailLog.builder().user(user).contact(contacts[1]).deal(d2)
            .subject("Your Custom CRM Proposal — Growthly x MiniCRM")
            .bodyPreview("Hi Marcus, as promised, I've attached the proposal tailored to Growthly's requirements...")
            .status(EmailStatus.OPENED).sentAt(LocalDateTime.now().minusDays(2))
            .openedAt(LocalDateTime.now().minusDays(1)).build());

        emailLogRepository.save(EmailLog.builder().user(user).contact(contacts[2]).deal(d3)
            .subject("Cold Intro — Replace Salesforce at Half the Cost")
            .bodyPreview("Hi Priya, Marcus mentioned you're evaluating CRM options. We've helped 3 similar companies migrate from Salesforce...")
            .status(EmailStatus.SENT).sentAt(LocalDateTime.now().minusDays(7)).build());

        emailLogRepository.save(EmailLog.builder().user(user).contact(contacts[4])
            .subject("Saw your company mentioned in TechCrunch — quick intro?")
            .bodyPreview("Hi Emma, congrats on the Series A! I noticed BrightMedia is scaling rapidly. Our CRM has helped similar companies...")
            .status(EmailStatus.REPLIED).sentAt(LocalDateTime.now().minusDays(10))
            .openedAt(LocalDateTime.now().minusDays(9)).repliedAt(LocalDateTime.now().minusDays(8)).build());

        log.info("Seeding complete! Demo login: demo@minicrm.io / demo1234");
    }
}
