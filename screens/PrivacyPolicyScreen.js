import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    LayoutAnimation,
    Dimensions
  } from "react-native";
import { ListItem } from 'react-native-elements';
import Colors from "../constants/Colors";


export default class PrivacyPolicy extends Component {
    render() {
        return (
            <ScrollView style={{padding: 15, flex: 1}}>
                <Text style={{fontSize: 24, fontWeight: "bold", textAlign: "center"}}>
                    Privacy Policy
                </Text>
                <Text style={{color: Colors.tintColor, textAlign: "center", paddingTop: 10}}>Last Updated: May 28, 2019</Text>

                <Text style={styles.subheader}>Our Commitment to Privacy</Text>
                <Text style={styles.text}>Your privacy is important to us. Our ongoing commitment to the protection of your privacy is essential to maintaining the relationship of trust that exists between connectED LLC ("connectED" "we" or "us"), the nonprofits or other volunteer organizations seeking volunteers (each, an "Agency"), and our users. This privacy policy (the "Privacy Policy") is intended to help you understand how we collect, use, and disclose your information.</Text>

                <Text style={styles.subheader}>User Consent</Text>
                <Text style={styles.text}>By submitting Information through our services, you expressly consent to the processing of your Information according to this Privacy Policy. Your Information may be processed by us in the country where it was collected as well as other countries (including the United States) where laws regarding processing of Information may be less stringent than laws in your country.</Text>

                <Text style={styles.subheader}>The Information We Collect</Text>
                <Text style={styles.text}>You may have accessed connectED by visiting "http://www.theconnectEDapp.com/,​ by using our mobile application, or through the site of one of our third-party partners with whom we have teamed to provide volunteering services (collectively, the "Services"), such as a connectED co-branding partner or a corporate partner (collectively, "Partners"). This notice applies to all information you submit to connectED through the Services. Please note that we cannot be responsible for the information you submit directly to third parties, including our Partners, who may have their own posted policies regarding the collection, use, and disclosure of your information. We urge you to review the policies of our Partners through whom you may access our services.{`\n`}{`\n`}The types of information, including without limitation personal information, ("Information") we may collect from users through the Services are:{`\n`}
                <Text style={styles.text}>{`\n`}{`\u25E6  `}First and Last Name</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Email address and password</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Telephone number</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Address, City and State (optional)</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Country and Postal Code</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Comments and feedback about volunteer experiences</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Connection history</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Geo-location information</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Information about your interests and skills</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Customized email preferences</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Past experience</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Other categories of information required or requested by an Agency to register for a particular volunteer opportunity.</Text>
                </Text>

                <Text style={styles.subheader}>For Agencies who use the Services to host volunteer opportunities we may collect:</Text>
                <Text style={styles.text}>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Administrator Information - First and Last Name; Email; Telephone Number; Postal Code; Username and Password. Address and City; State; Country</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Agency Information - Agency Name; Contact Information (Contact Title, First and Last Name, Telephone Number, Address, City, State, Country, Postal Code, Email); Description of Services; Mission Statement; Tax ID/EIN, NCES school ID, and/or proof of non-profit status, as applicable; Affiliations; Volunteer Type Category. Web site Address; Fax (optional).</Text>
                <Text style={styles.text}>{`\n`}{`\u25E6  `}Volunteer Opportunity Information - Opportunity Title; Contact Email; Description; Volunteer Type; Location Information (either Street Location or "Virtual" Designation). Required Skills and Other Requirements; Date; Time; Commitment Information; Volunteer Age; Group Size; photo.</Text>
                </Text>

                <Text style={styles.subheader}>How We Use Information</Text>
                <Text style={styles.text}>We do not sell, rent, or trade our user Information (whether volunteer, administrator, or nonprofit users) to outside parties. We use the Information we collect about you to provide and improve the Services, facilitate the volunteering process, respond to your requests, and to provide information to you about connectED and related industry topics.{`\n`}{`\n`}Please be aware that, to the extent required to provide our services, we share your Information with volunteer users, Agencies, our third-party service providers, or our Partners, as applicable. We may use our email lists for sending out connectED outbound communications. We also reserve the right to use your Information to send you transactional e-mails, and you cannot opt out of receiving transactional e-mails without deleting your account (by email us at i​ nfo@theconnectEDapp.com​).{`\n`}{`\n`}Please note that any feedback or comments provided by you on the Web site may be generally accessible by any visitor to the Web site. Therefore, please take care when posting feedback or comments to the site, as you will forfeit the privacy of that information.</Text>

                <Text style={styles.subheader}>If you are a volunteer user, we may also use your Information in the following ways:​</Text>
                <Text style={styles.text}>If you indicate to us that you are interested in creating a personalized account, the information we gather from you will be used to provide you with the Services and permit you to: access the account, customize your profile with skills and interests, customize outbound email services, review your connection history and/or post a resume that can be sent as an attachment to inquiries you make using the connectED service.{`\n`}{`\n`}To the extent that you have provided any Information to us through our Services regarding volunteer opportunities associated with one of our Partners or have accessed the Services through a Partner, we may share your Information and connection history with the applicable Partner. Each of our Partners has its own policies regarding the collection and use of personal information, and connectED is not responsible for their use of your Information. Furthermore, our Partners may collect additional information from you, independent of connectED.org, in connection with the volunteer services.</Text>

                <Text style={styles.subheader}>If you are an Agency, we may also use your Information in the following ways:</Text>
                <Text style={styles.text}>If you submit Information to us as an Agency, then, subject to the terms and conditions as a nonprofit member of connectED, your Information (excluding your EIN number) will be accessible by anyone who accesses connectED. In addition, we may share your Information, including your EIN number, with selected Partners in order to verify your Agency's identity and tax status.{`\n`}{`\n`}Agencies who receive email addresses from potential volunteer signups are strongly encouraged to adopt privacy standards similar to those of connectED (but in each case, you must comply with all applicable privacy laws and regulations). Inappropriate use of personal information received from connectED may jeopardize nonprofit membership with connectED. connectED reserves the right to determine, in its discretion, what constitutes inappropriate use of this information and to terminate Agency access to the Services for such misuse.</Text>

                <Text style={styles.subheader}>Third-party Access and Use</Text>
                <Text style={styles.text}>Occasionally, we or our Partners, use third-party service providers to help provide or improve the services we offer you. Sometimes these providers have access to the Information we collect about you as a part of providing, maintaining, and improving the Services. We share aggregate information about our users with certain third parties. This information shows user activity at a group level, rather than on an individual basis.{`\n`}{`\n`}In the event that connectED undergoes a sale or transfer of all or substantially all of its assets, the acquiring entity may use your Information subject to this Privacy Policy. In addition, in the further unlikely event that connectED is adjudicated bankrupt or insolvent (a) there will be no further use or disclosure of your personally identifiable Information by connectED and (b) reasonable efforts will be taken to ensure your personally identifiable Information on connectED's servers will be destroyed. In addition, there will be no use or disclosure of your personally identifiable Information by any entity that acquires assets of connectED pursuant to such bankruptcy or insolvency proceedings.{`\n`}{`\n`}Due to factors beyond our control, however, we cannot fully ensure that your Information will not be disclosed to third parties. For example, we may be legally obligated to disclose Information to the government or third parties under certain circumstances, or third parties may circumvent our security measures to unlawfully intercept or access your Personal Information.</Text>

                <Text style={styles.subheader}>Children's Privacy</Text>
                <Text style={styles.text}>We welcome Volunteers of all ages, including children under the age of thirteen. This requires compliance with the Children's Online Privacy Protection Act (COPPA). ​COPPA imposes certain requirements on operators of websites or online services directed to children under 13 years of age, and on operators of other websites or online services that have actual knowledge that they are collecting personal information online from a child under 13 years of age.</Text>

                <Text style={styles.subheader}>Cookies and Analytics</Text>
                <Text style={styles.text}>Cookies are tiny data files that websites commonly write to your hard drive when you visit them so that they can remember you when you visit. A cookie file contains information that can identify you anonymously and maintain your account's privacy. Our Service uses cookies to maintain a user's identity between sessions so that the site can be personalized based on user preferences or a user's history. We may use information collected using third party cookies (for example, Google AdSense and DoubleClick) and Web beacons on our Services to deliver connectED advertising displayed to you on third party sites. We also use cookie information to know when you return to our Site after visiting these third party sites. We also use analytics services (Such as Google Analytics, Optimizely, ClickTale, New Relic, and others) to help analyze how users use the Services. These analytics services use cookies to collect and store information such as how often users visit the Services, what pages they visit, and what other sites they used prior to coming to the Services. We also use the information from these analytics services to improve our Services and to provide reporting to our Partners regarding site activity and utilization. Please see the following links for more information about Google Analytics, DoubleClick, and Google AdSense:{`\n`} http://www.google.com/policies/technologies/ads/​ and {`\n`}http://www.google.com/policies/privacy/.​{`\n`}{`\n`}You can set your web browser to prompt you before you accept a cookie, accept cookies automatically or reject all cookies. However, if you choose not to accept cookies from this web site, then you may not be able to access and use all or part of this web site or benefit from the information and services which it offers.</Text>

                <Text style={styles.subheader}>Web Beacons</Text>
                <Text style={styles.text}>Pages on the Services and emails that connectED sends to you may contain small image files called web beacons. Web beacons are used as a mechanism to help us track your visits to our site and whether or not you open our emails. In addition, we use several third-party services that embed web beacons on our site for similar tracking purposes. These third-party services are used to provide additional features to users, such as the ability to share content on our site with your social network.</Text>

                <Text style={styles.subheader}>Links</Text>
                <Text style={styles.text}>The Services contains links to other third-party sites. connectED is not responsible for the privacy practices or the content of such third-party sites.</Text>

                <Text style={styles.subheader}>How You Can Review Or Correct Your Information</Text>
                <Text style={styles.text}>If you are a volunteer with a personal connectED account, once you login in, you may make any changes or correct factual errors in your account by changing the information on your login page. This option is available to better safeguard your Information, subject to downtime for standard maintenance and support. You do not need to contact us to access your record or to make any changes. If you have problems changing your Information, please contact Community Services at ​info@theconnectEDapp.com.​{`\n`}{`\n`}If you are an Agency administrator, you may make any changes or correct factual errors in your administrator, organization and opportunity information. We use this procedure to better safeguard your Information. You do not need to contact us to access your record or to make any changes. If you have problems changing your Agency's Information, please contact Community Services at ​info@theconnectEDapp.com.​{`\n`}{`\n`}If you are a nonprofit member or volunteer with an account and would like to have your Information deleted from the site, you may contact Community Services at info@theconnectEDapp.com.​</Text>

                <Text style={styles.subheader}>Your Choices Regarding your Information and Newsletters & Communications</Text>
                <Text style={styles.text}>Subscriptions to connectED newsletters and Opportunity Alerts are optional and connectED allows Agencies, volunteers, subscribers or other users to unsubscribe from these newsletters and alerts at any time. In each newsletter we provide instructions regarding how to opt-out from receiving future newsletter mailings. You can email us at ​info@theconnectEDapp.com to remove your name from our newsletter subscription database and ensure that you will cease receiving future newsletters from us.{`\n`}{`\n`}We may also use our email lists for sending out other non-promotional connectED outbound communications such as product enhancements, tool upgrades, or service availability. Registered members are required to receive these communications.{`\n`}{`\n`}When you visit our Services, we and others give you the following choices about use of mechanisms for tracking, including tracking of your online activities over time and across different websites and online services by third parties. Many Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies from connectED and other parties. If you choose to remove cookies or reject cookies, this could affect certain features of our Services. You can choose to opt-out of use of cookies by certain third-party analytics providers and advertising networks to deliver ads tailored to your profile and preferences. Many such third parties are a part of the National Advertising Initiative opt-out: ​https://www.networkadvertising.org/choices/.​ If you delete your cookies, use a different browser, or buy a new computer, you will need to renew your opt-out choice. While we and others give you choices described in this Privacy Policy, there are many ways Web browser signals and other similar mechanisms can indicate your choice to disable tracking, and we may not be aware of or honor every mechanism.</Text>

                <Text style={styles.subheader}>Our Commitment To Data Security</Text>
                <Text style={styles.text}>To prevent unauthorized access, maintain data accuracy, and ensure the correct use of Information, we have put in place reasonable physical, electronic, and managerial procedures in an effort to safeguard and secure the Information we collect online. If you have any questions about our data security or data retention practices, please email us at info@theconnectEDapp.com​ and we will work to provide you with the answers you require.</Text>

                <Text style={styles.subheader}>Changes to Policy</Text>
                <Text style={styles.text}>This Privacy Policy is subject to occasional revision. If we make any changes to this Privacy Policy, we will change the "Last Updated" date above.</Text>

                <Text style={styles.subheader}>How To Contact Us</Text>
                <Text style={styles.text}>We appreciate your questions or comments about this privacy statement, the practices of the Services, or your dealings with connectED. We also want to work carefully with you to resolve any disputes or issues you might have. Please send email to info@theconnectEDapp.com​ or you can send snail mail to connectED, 12703 Research Parkway, Suite 100, Orlando, FL 32826..{`\n`}{`\n`}</Text>
                
            </ScrollView>
        );
    }
    
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    subheader: {
        textDecorationLine: "underline",
        paddingTop: 15,
        paddingBottom: 10,
        fontSize: 16,
        lineHeight: 20,
    },
    text: {
        fontSize: 16,
        lineHeight: 20
    }

  });
  