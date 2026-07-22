PRAGMA foreign_keys=OFF;
CREATE TABLE clubs(id INTEGER PRIMARY KEY,name TEXT UNIQUE);
INSERT INTO clubs VALUES(1,'Technical Club');
INSERT INTO clubs VALUES(2,'Financial Literacy Club');
INSERT INTO clubs VALUES(3,'Cultural Club');
INSERT INTO clubs VALUES(4,'Film Club');
INSERT INTO clubs VALUES(5,'Media Club');
INSERT INTO clubs VALUES(6,'Sports Club');
INSERT INTO clubs VALUES(7,'Innovation and entrepreneurship');
INSERT INTO clubs VALUES(8,'Women Empowerment Club');
INSERT INTO clubs VALUES(9,'Club Co-ordinators');
CREATE TABLE members(id INTEGER PRIMARY KEY,roll_number TEXT UNIQUE,full_name TEXT,email TEXT,phone TEXT,department TEXT,section TEXT,member_type TEXT, uuid TEXT, year INTEGER DEFAULT 1, status TEXT DEFAULT 'active', photo_url TEXT, position TEXT);
INSERT INTO members VALUES(1,'25MVCSDR0017','Erukala Aravind Kumar ','aravinderukala24@gmail.com','7337421803','CSE-DS','A','student','e9a054a4-90d7-48ea-a4ec-5a5f479db49f',1,'active',NULL,NULL);
INSERT INTO members VALUES(2,'25MVCSMR0311','KADIYALA ABHIRAM ','abhiramkadiyala123@gmail.com','8341785904','CSE-AI/ML','D','student','e7bae9a0-b189-4cac-ad9f-7498023a005c',1,'active',NULL,NULL);
INSERT INTO members VALUES(3,'25MVCSMR0343','Vishal Pokala','Vishalmudhirajpokala@gmail.com','9676694041','CSE-AI/ML','D','student','e2a5fe64-edba-416d-af18-89c8156daccd',1,'active',NULL,NULL);
INSERT INTO members VALUES(4,'25MVCSDR0164','Suhana Saloni ','suhanasalonimd@gmail.com','9948144589','CSE-DS','B','student','a4096f38-e87b-48db-8e9e-42fd264c493b',1,'active',NULL,NULL);
INSERT INTO members VALUES(5,'25MVCSMR0460','Amalakota Shanmukha Surya Ram Akhil ','akhilamalakota14@gmail.com','9848585655','CSE-AI/ML','F','student','0095e0e3-abfc-46f0-bcb7-ce90b3dea93f',1,'active',NULL,NULL);
INSERT INTO members VALUES(6,'25MVCSER0177','VADDE NELAGONDA SUDHAKAR ','sudhakarvadde2007@gmail.com','9515030057','CSE','B','student','9c5182da-623e-4999-8f9a-9279a0dba31f',1,'active',NULL,NULL);
INSERT INTO members VALUES(7,'25MVECER0010','C. Vishnu Liktih ','vishnulikith12@gmail.com','8125182062','ECE','A','student','1c462799-50dd-4c9f-95b3-b1d750af06bc',1,'active',NULL,NULL);
INSERT INTO members VALUES(8,'25MVCSER0089','Yogi Uta','yogiuta8143@gmail.com','8790909270','CSE','A','student','0a433873-4f10-40db-9969-6b8cbcca4672',1,'active',NULL,NULL);
INSERT INTO members VALUES(9,'25MVEFER0023','E.Basavesear','basaveshwar171@gmail.com','9502339401','ECE','A','student','43ef290c-cd26-43b5-bdd0-71f7302534f8',1,'active',NULL,NULL);
INSERT INTO members VALUES(10,'25MVCSDR0304','Kasanagottu Siddhartha ','k.siddhartha2008@gmail.com','6301935993','CSE-DS','D','student','d9c473e8-a6e5-4c3e-a83e-14b18baa681c',1,'active',NULL,NULL);
INSERT INTO members VALUES(11,'25MVECEROO25','G.Harshitha','harshithareddyganireddy26@gmail.com','9398063773','ECE','A','student','889c4f29-2576-41c9-8cbd-5d1caf4e72bd',1,'active',NULL,NULL);
INSERT INTO members VALUES(12,'25MVICBR0009','Dhurjeti Pratap Sharma ','dpratapsharma@gmail.com','8977668904','IOT/R&A','A','student','0811dac0-a868-4bd4-8cc0-9fe438b12db0',1,'active',NULL,NULL);
INSERT INTO members VALUES(13,'24MVCSER0046','IYILA JASHWANTH GOUD ','jaswanth2115@gmail.com','6309921107','CSE','A','student','7027b79f-2f15-45fe-b02d-a55ac94cc70e',1,'active',NULL,NULL);
INSERT INTO members VALUES(14,'25MVCSMR0330','MOHAMMAD SAYFULLA','mdsayfulla.5617@gmail.com','9849405617','CSE-AI/ML','D','student','0c95ed8c-8a77-48db-976e-c83f8d2f114a',1,'active',NULL,NULL);
INSERT INTO members VALUES(15,'25MVCSDR0003','Amdurthi Navya Sri ','chinnyamudurthi@gmail.com','6303918647','CSE-DS','A','student','165a9cbf-73fd-4a56-bd59-1bbd62c3a435',1,'active',NULL,NULL);
INSERT INTO members VALUES(16,'25MVCMR0071','Pragna Sree Allu','pragna.allu2007@gmail.com','7386456863','CSE-AI/ML','A','student','7bf38ad0-0f4b-4e09-8147-e4cde3ca13bb',1,'active',NULL,NULL);
INSERT INTO members VALUES(17,'25MVCSDR0200','CHOPPARI SHIVA ','chopparishivayadav@gmail.com','8179414994','CSE-DS','C','student','e8df47b2-40a3-4188-bafe-c870b79bb1e6',1,'active',NULL,NULL);
INSERT INTO members VALUES(18,'25MVCSDR0394','Ganta Vishalini ','vishaliniganta120@gmail.com','9346929395','CSE-DS','E','student','05e62093-3b88-4499-99f6-0e000f0cee6f',1,'active',NULL,NULL);
INSERT INTO members VALUES(19,'25MVCSER0350','TADAVENI SAI HANSINI ','hansinitadaveni28@gmail.com','7396933142','CSE','D','student','01c1bb94-b38c-40a9-a3c6-b93e22668b8b',1,'active',NULL,NULL);
INSERT INTO members VALUES(20,'25MVCSDR0020','Gattu Sathvika','Sathvikaa015@gmail.com','8639798699','CSE-DS','A','student','f3c8ee52-7f76-4b3d-b345-9b0c1cb9c219',1,'active',NULL,NULL);
INSERT INTO members VALUES(21,'25MVCSER0360','Yenugula Vipul Reddy ','yenugulavipulreddy947@gmail.com','8885004449','CSE','D','student','5f92a40e-3344-4f77-a800-03159831e8c6',1,'active',NULL,NULL);
INSERT INTO members VALUES(22,'25MVCSDR0451','Anakar Sridhar ','Anakarsridhar@gmail.com','6300077578','CSE-DS','F','student','99eac601-5829-4db5-a33b-3be09149a34f',1,'active',NULL,NULL);
INSERT INTO members VALUES(23,'25MVCSMR0358','Shivansh Mishra','shivansh.mishraa2007@gmail.com','8885279030','CSE-AI/ML','D','student','0696a449-4e88-4f1a-9c6a-0ea3a93cfc37',1,'active',NULL,NULL);
INSERT INTO members VALUES(24,'25MVICBR0053','Tanishta Konisetty ',NULL,'73866 80178 ','IOT/R&A',NULL,'student','ecd7e789-dd28-4711-90e5-53c2eb3acb3b',1,'active',NULL,NULL);
INSERT INTO members VALUES(25,'25MVCSMR0288','BELLAM RAJA VAMSI TEJA',NULL,'7799234747','CSE-AIML','D','student','796a6466-4fc1-4641-80c1-d575739ee3a9',1,'active',NULL,NULL);
INSERT INTO members VALUES(26,'25MVCSER0237','P charan teja',NULL,'9392301480','CSE','Cse-c','student','a9e6b8e1-99d3-4a2f-9467-ebb56ae72ee9',1,'active',NULL,NULL);
INSERT INTO members VALUES(27,'25MVCSER0235','Neelam Rajesh ',NULL,'9642495622','CSE','C','student','3ed3abf8-13ba-4d2f-b8d8-8e80f8543933',1,'active',NULL,NULL);
INSERT INTO members VALUES(28,'25MVICBR0008','Bhupathi.Lohitha',NULL,'8374656717','IOT/R&A','A','student','94b0cfc3-1872-4e0f-aa6f-aa660206ae3d',1,'active',NULL,NULL);
INSERT INTO members VALUES(29,'25MVCSMR0300','DASARI SRINITYA ',NULL,'8374932733','CSE-AIML','D','student','63ac4eaa-81b1-4d1d-9d1c-e858844648a9',1,'active',NULL,NULL);
INSERT INTO members VALUES(30,'25MVCSDR0403','Sai durga mahesh ',NULL,'7893945427','CSE-DS','E','student','ce6a1a65-88ee-47e7-93a5-c1e8f9f055b8',1,'active',NULL,NULL);
INSERT INTO members VALUES(31,'25MVCSER005','Akula Manasvi',NULL,'9704863463','CSE','A','student','9585eecf-9955-4749-b175-baec98a64303',1,'active',NULL,NULL);
INSERT INTO members VALUES(32,'25MVCSER0279','BAIKANI THANAVI YADAV',NULL,'7660973316','CSE','D','student','c63243ad-200a-4f31-800c-6d70a7bec217',1,'active',NULL,NULL);
INSERT INTO members VALUES(33,'2MVCSER0048','Jakkula Akshaya ',NULL,'9032280904','CSE','A','student','21ab1797-6c05-4789-80b9-5d668e49e39b',1,'active',NULL,NULL);
INSERT INTO members VALUES(34,'25MVCSER0542','Asampalli Rajasree ',NULL,'7386107300','CSE','G','student','2218bc4b-83be-4751-960d-b79eeed91055',1,'active',NULL,NULL);
INSERT INTO members VALUES(35,'25MVCSER0550','Bondla Abhinay ',NULL,'8374349756','CSE','G','student','4e5f166d-25d5-460b-bb77-1e476351cd3c',1,'active',NULL,NULL);
INSERT INTO members VALUES(36,'25MVCSMR0584','Mamidi Swathi ',NULL,'9014994606','CSE-AIML','G','student','d8ef0c97-22bf-4da0-a88c-e9464a1972f2',1,'active',NULL,NULL);
INSERT INTO members VALUES(37,'559','Amrutha Varshini ',NULL,'7671019099','CSE-AIML','G','student','8f05cdd8-3bdc-4b53-9b2a-d0526de25f4c',1,'active',NULL,NULL);
INSERT INTO members VALUES(38,'25MVCSDR0159','Roopika Ishwarya Gangireddy ',NULL,'88970 51605','CSE-DS','B','student','1587d183-dc99-406c-8085-11da0b1eb6fe',1,'active',NULL,NULL);
INSERT INTO members VALUES(39,'25MVCSER0629','Vishwanadhula Vennela ',NULL,NULL,'CSE',NULL,'student','7d050f78-54b8-41f4-b920-30973f9146ea',1,'active',NULL,NULL);
INSERT INTO members VALUES(40,'25MVCSMRO615','S. Kusuma',NULL,'7569216154','CSE-AIML','G','student','f63cef75-1ae1-4e90-a456-629aeecdb855',1,'active',NULL,NULL);
INSERT INTO members VALUES(41,'25MVCSDR0242','Pittala charanya ',NULL,'9347824204','CSE-DS','C','student','0a9e3f2b-10d5-4b5e-b23d-22e5fd54d60c',1,'active',NULL,NULL);
INSERT INTO members VALUES(42,'25MVCSDR0245','RAMAGOUNI VAISHNAVI ',NULL,'6301287431','CSE-DS','C','student','b5ac8a55-3232-424e-b1e8-fd3f6f362781',1,'active',NULL,NULL);
INSERT INTO members VALUES(43,'25MVCSER0495','Mallampalli Sai Pranavi ',NULL,'8125512051','CSE','F','student','f11f6bdd-bd88-472e-9859-17a0bd736a6a',1,'active',NULL,NULL);
INSERT INTO members VALUES(44,'25MVCSMR0425','Nithyavarshini',NULL,'7207043426','CSE-DS','E','student','57b4cfc2-8d38-4ad4-bdcc-48ba075296ac',1,'active',NULL,NULL);
INSERT INTO members VALUES(45,'25MVCSMR0538','Yalamaddi Prashanth ',NULL,'8978293741','CSE-AIML','F','student','a7a9031a-de17-4e94-905f-bfa84c245953',1,'active',NULL,NULL);
INSERT INTO members VALUES(46,'25MVCSDR0514','M.Sanjay Kumar','mandasanjay22@gmail.com','7093518181','CSE-DS','F','student','f2073e9b-1752-4eff-935e-c60dda934081',1,'active',NULL,NULL);
INSERT INTO members VALUES(47,'25MVCSER0619','SayedRehan ','sayedrehan9386@gmail.com','9866889325','CSE','G','student','308825bb-33c2-49fa-8e8c-d7137c80fb2e',1,'active',NULL,NULL);
INSERT INTO members VALUES(48,'25MVECER0076','Sagar Pooja ','poojasagar89341@gmail.com','9440804592','ECE','A','student','5675406f-a689-41f6-b006-8f04fb2995bc',1,'active',NULL,NULL);
INSERT INTO members VALUES(49,'25MVCSMR0032','D. ABHILASH REDDY ','abhilashreddydhavu@gmail.com','9618848354','CSE-AI/ML','A','student','56e15a7d-798f-459f-9ce7-cab140d5509d',1,'active',NULL,NULL);
INSERT INTO members VALUES(50,'25MVCSDR0259','Meghana thanneeru','thanneerumeghana29@gmail.com','7207232490','CSE-DS','C','student','f7ede3d1-c30e-4568-a750-2985724a4738',1,'active',NULL,NULL);
INSERT INTO members VALUES(51,'25MVCSER0049','JALAGARI SHARVANI ','jalagarisharvani@gmail.com','8341942878','CSE','A','student','9e7632ad-00f5-4fec-b5fb-0b0cb063d8a7',1,'active',NULL,NULL);
INSERT INTO members VALUES(52,'25MVCSMR0092','YARAGANI VARUN TEJA ','tejayaragani015@gmail.com','7569721838','CSE-AI/ML','A','student','f234456f-4c70-459d-82ba-df7c9e4e99bd',1,'active',NULL,NULL);
INSERT INTO members VALUES(53,'25MVCSDR0207','Gaddam saiganesh ','gadamlingaswamyi@gmail.com','8374066962','CSE-DS','C','student','742b39da-5da9-4075-ab8b-ddbaf80b8744',1,'active',NULL,NULL);
INSERT INTO members VALUES(54,'25MVCSDR0529','Memba Avinash ','Avinashmemba@gmail.com','8125349696','CSE-DS','F','student','ca4400aa-6e2b-4918-b245-17d4d5bf81a6',1,'active',NULL,NULL);
INSERT INTO members VALUES(55,'25MVCSER0423','P.GAYATRI','gayupeddinti2k8@gmail.com','7207896655','CSE','E','student','ff48171e-4d1b-4573-aee5-f8c176a129e4',1,'active',NULL,NULL);
INSERT INTO members VALUES(56,'25MVCSMR0122','Gundlakonda Manisha ','gundlakondamanisha@gmail.com','6302435072','CSE-AI/ML','B','student','c2ea2723-486c-4188-b8e3-65666c9ffe55',1,'active',NULL,NULL);
INSERT INTO members VALUES(57,'25MVCSER0003','Achyutha santhoshi naga vismaya ','visuachyu15@gmail.com','9398287393','CSE','A','student','69ed9fb8-8a78-4d01-8efa-07484f9f9576',1,'active',NULL,NULL);
INSERT INTO members VALUES(58,'25MVCSER0370','Batchu Varshini ','batchuvarshini23@gmail.com','9948009701','CSE','E','student','fa03810c-0b27-4d91-bcbd-f569502189ac',1,'active',NULL,NULL);
INSERT INTO members VALUES(59,'25MVCSMR0109','Chappidi Sruthi','sruthichappidi0809@gmail.com','9392077986','CSE-AI/ML','B','student','33b53b8f-2458-4c9c-bca3-330bb444b945',1,'active',NULL,NULL);
INSERT INTO members VALUES(60,'25MVICBR0031','Marripudi Manitha ','manithamarripudi92@gmail.com','8919661266','IOT/R&A','A','student','a40481ab-ce8a-4b25-ad1f-4967eadb6a6a',1,'active',NULL,NULL);
INSERT INTO members VALUES(61,'25MVCSER0445','THALLAPALLI RISHWIK GOUD ','tallapallyrishwik@gmail.com','7075631421','CSE','E','student','f9191e8d-5632-4c02-b85c-e6908dccd3e7',1,'active',NULL,NULL);
INSERT INTO members VALUES(62,'A','Indarapu sriya ','Sriyaindharapu@gmail.com','8019832200','CSE','F','student','75261ade-292b-44c8-9a3a-8fd78245f999',1,'active',NULL,NULL);
INSERT INTO members VALUES(63,'25MVCSER0501','Marthala pavan reddy','marthalapavanreddy0007@gmail.com','8919736091','CSE','F','student','881ecb27-4817-4621-af26-3394fb54211a',1,'active',NULL,NULL);
INSERT INTO members VALUES(64,'25MVCSDR0250','Uttej','Sandhi Uttej Reddy','8328414634','CSE-DS','C','student','ec38b0c3-8883-44b2-b743-d925de931110',1,'active',NULL,NULL);
INSERT INTO members VALUES(65,'25MVCSDR0019','Gara Mani kanta',NULL,NULL,'CSE-DS','A','student','65342ce0-d55b-41a9-9012-f44d2d057546',1,'active',NULL,NULL);
INSERT INTO members VALUES(66,'25MRVCSER0539','Yarabati Gokul Saba ','gokulsabayarabati@gmail.com','8520838497','CSE','F','student','f07f1cc5-8809-4f31-ab19-cca177ebce2c',1,'active',NULL,NULL);
INSERT INTO members VALUES(67,'25MVCSDR0124','Kanugula Anshika ','anshikakanugula@gmail.com','8143395034','CSE-DS','B','student','8e59cc1f-6390-48b6-bb47-9d8a4a908331',1,'active',NULL,NULL);
INSERT INTO members VALUES(68,'25MRVCSDR0075','S venkata siva','mrvenkatshiva@gmail.com','7093358762','CSE-DS','A','student','430a14e5-b960-4ed2-b994-18c234dd9eba',1,'active',NULL,NULL);
INSERT INTO members VALUES(69,'25MVCSMR0331','Moola Omprakash ','avinashmoola3@gmail.com','9281443467','CSE-AI/ML','D','student','6753cb5d-cce7-45d7-907c-cded0eee3231',1,'active',NULL,NULL);
INSERT INTO members VALUES(70,'25MVCSER0611','P. Sri charan deep','pcharandeep6@gmail.com','8309746943','CSE','G','student','ff1bf954-77be-4240-91c4-c3c27b4380f0',1,'active',NULL,NULL);
INSERT INTO members VALUES(71,'25MVCSDR0287','BOINIPELLY ASHWITH RAO ','ashwithraoboinipelly@gmail.com','9182853073','CSE-DS','D','student','624a1e86-cdcf-44b7-b038-4c68edb066d1',1,'active',NULL,NULL);
INSERT INTO members VALUES(72,'25MVCSER0386','Golipalli Divya ','golipallidivya@gmail.com','9063159309','CSE','E','student','59be88d6-12a2-4cb4-85eb-f1601ccc889a',1,'active',NULL,NULL);
INSERT INTO members VALUES(73,'25MVCSMR0421','MUDUNURI SUSHANTH ','sushanthsushanth86259@gmail.com','7075655608','CSE-AI/ML','E','student','d957b03c-6616-4133-b3a7-306cff97b390',1,'active',NULL,NULL);
INSERT INTO members VALUES(74,'25MVCSDR0252','shaik farhan','shaikfarhan272@gmail.com','6302627161','CSE-DS','C','student','cde82987-e751-460a-8964-6b5e06c47679',1,'active',NULL,NULL);
INSERT INTO members VALUES(75,'25MVCSRO528','Singupuram Pavan ','pavansingupuram27@gmail.com','8688936775','CSE','F','student','e6465695-b98f-477f-b572-b720b477dd1a',1,'active',NULL,NULL);
INSERT INTO members VALUES(76,'25MVICBR0022','Gireshsaiteja','girisaiteja9001@gmail.com','7780396699','IOT/R&A','A','student','c273ddcc-70e4-47bd-8d5b-2a8df7e9e193',1,'active',NULL,NULL);
INSERT INTO members VALUES(77,'25MVBBARO0018','Lyadalla sai Charan ','Saic93712@gmail.com','7995045629','CSE','A','student','e148de1d-6e06-4975-acb7-913d1f9fc647',1,'active',NULL,NULL);
INSERT INTO members VALUES(78,'25MVCSER0547','Bhuvana kruthy ','abkruthy30@gmail.com','7013390679','CSE','G','student','fd8496e4-d5c5-4ab3-8025-dab47913d221',1,'active',NULL,NULL);
INSERT INTO members VALUES(79,'25MVBBAR0013','K.VISHAL REDDY','Vickylucky9nrpt@gmail.com','9014640321','CSE','A','student','05a8197d-55d3-4370-94a1-9945cf7c46ea',1,'active',NULL,NULL);
INSERT INTO members VALUES(80,'25MVCSDR0094','Atmakuri venkateswarlu','venkateswarlu9x@gmail.com','812413981','CSE-DS','B','student','3f6f8d48-e31f-4a0d-a5a9-2888f3c85d1e',1,'active',NULL,NULL);
INSERT INTO members VALUES(81,'25MVCSER0125','K.Reena Varshini','reenavarshini.2008@gmail.com','9618862863','CSE','A','student','261f1d24-985b-4687-9b3e-528bc03fe81a',1,'active',NULL,NULL);
INSERT INTO members VALUES(82,'25MVCSER0141','Manvi Maremanda','manvi.maremanda@gmail.com','9989114107','CSE','B','student','8895b656-48f2-4e48-ae63-15d032f8472d',1,'active',NULL,NULL);
INSERT INTO members VALUES(83,'25MVBBAR0001','Yashwanth reddy Adlla','adllayashwanthreddy63@gmail.com','6301842431','CSE','A','student','03e8cc5c-c659-4d35-a9c6-d4194e020d7e',1,'active',NULL,NULL);
INSERT INTO members VALUES(84,'25MVCSDR0162','Shaik Nazeer hussain','nazeerhussain7271@gmail.com','6302128024','CSE-DS','B','student','d5569b6d-b8a0-4505-8fd9-051e6d84a42e',1,'active',NULL,NULL);
INSERT INTO members VALUES(85,'25MRVCSER0603','M Gouthika',NULL,'8977656959','CSE','G','student','3b53afc0-1650-4ab8-9adc-6a3c025d33e8',1,'active',NULL,NULL);
INSERT INTO members VALUES(86,'25MVCSMR0393','Gandham Charan Tej Reddy','charantejreddygandham5@gmail.com','9030570819','CSE-AI/ML','E','student','0a9022b8-84ea-42b9-b637-2df332471674',1,'active',NULL,NULL);
INSERT INTO members VALUES(87,'25MVCSMR0470','Meghan sai','meghansai9696@gmail.com','6305848712','CSE-AI/ML','F','student','92e848e2-ff31-493a-b82a-f579cf4bfd68',1,'active',NULL,NULL);
INSERT INTO members VALUES(88,'25MVCSER0637','Deekshith','deekshithgoturi@gmail.com','7396836655','CSE','H','student','04e90a06-2302-4bc2-919d-a6a254761bee',1,'active',NULL,NULL);
INSERT INTO members VALUES(89,'15MVCSER0402','K.vinay kumar','nsd623750@gmail.com','9949314587','CSE','E','student','759d7517-4c10-42dd-bbbe-d58e4ab12399',1,'active',NULL,NULL);
INSERT INTO members VALUES(90,'25MVCSER0055','Kathi Aravind','kathiaravind361@gmail.com','7816036192','CSE','A','student','4fb2ed30-8d72-43ca-a955-a0fbb9757e75',1,'active',NULL,NULL);
INSERT INTO members VALUES(91,'25MVCSDR0125','Kasam Kavya','kasamkavya08@gmail.com','8309095420','CSE-DS','B','student','a419a139-7642-4585-82f0-6e5028d4065e',1,'active',NULL,NULL);
INSERT INTO members VALUES(92,'25MVCSER0105','CHAVA TEEKSHITHA','theekshithachava@gmail.com','9059475971','CSE','A','student','3a08a91a-acfd-4340-8dec-129bfd73b5f9',1,'active',NULL,NULL);
INSERT INTO members VALUES(93,'25MVCSDR0537','KOLLURI MOUNISH VASANTH KRISHNA ','mounishvkrishna@gmail.com','9381465376','CSE-DS','F','student','ff26125e-a5f3-46bc-9b62-011031c6e9e9',1,'active',NULL,NULL);
INSERT INTO members VALUES(94,'25MVCSMR0505','Ganesh','Ganeshlattupally@gmail.com','9505686085','CSE-AI/ML','F','student','841913e1-8022-4395-ac8c-5f58bff3c5d7',1,'active',NULL,NULL);
INSERT INTO members VALUES(95,'25MVECER0004','BAPU HARIESHWAR REDDY ','harishwarsunny@gmail.com','8309516422','ECE','A','student','4427ad1c-fc8f-4247-975c-4ec2ee1d75ef',1,'active',NULL,NULL);
INSERT INTO members VALUES(96,'25MVCSDR0163','Sonu Choudary ','sonuchoudhary28498@gmail.com','8639250946','CSE-DS','B','student','1a181a70-55a2-42f3-9e3b-c403e4403a2b',1,'active',NULL,NULL);
INSERT INTO members VALUES(97,'25MVCSDR0377','CHEPURI SAITEJA ','saitejac27@gmail.com ','7036353798','CSE-DS','E','student','bc9468e7-0343-467c-98e8-523a97052247',1,'active',NULL,NULL);
INSERT INTO members VALUES(98,'25MVBBAR0029','Roshni Yadav ','roshnijhcssp@gmail.com','9866019412','CSE','A','student','5402c161-62d4-481c-8d14-1c32ee4eb456',1,'active',NULL,NULL);
INSERT INTO members VALUES(99,'25MVCSER0251','Sheelamshetty Vaishnavi ','sheelamshettyvaiahnavi@gmail.com','9392239094','CSE','C','student','54acc84a-109d-4463-ba1e-961597f315cd',1,'active',NULL,NULL);
INSERT INTO members VALUES(100,'25MVCSDR0198','Chelakani Sri Charan','sricharanchelakani470@gmail.com','8317534070','CSE-DS','C','student','cd79df4e-b6b0-4370-acef-394a31670214',1,'active',NULL,NULL);
INSERT INTO members VALUES(101,'25MVCSER0204','Gowthu mohan vasanth naga aashish ','gowthuaashish@gmail.com','8309262544','CSE','C','student','0c523d0b-e13e-475a-96c5-be5cfe67b395',1,'active',NULL,NULL);
INSERT INTO members VALUES(102,'25MVCSER0357','V Rishiteja ','velumularishiteja@gmail.com','9390839005','CSE','D','student','aaa48662-6c0f-426a-99ed-ee4b182ceac4',1,'active',NULL,NULL);
INSERT INTO members VALUES(103,'25MVCSER0029','Lokesh',NULL,'9014877977','CSE','A','student','a8fcf83b-a828-46ad-90a2-0461da1409c5',1,'active',NULL,NULL);
INSERT INTO members VALUES(104,'25MVCSMR0305','Gaddam Akshith Reddy','akshithgaddam656@gmail.com','8501080569','CSE-AI/ML','D','student','bddf1b02-b05e-4bab-89f3-427316f378a5',1,'active',NULL,NULL);
INSERT INTO members VALUES(105,'25MVCSMR0215','Donthiboina Navya ','n61188971@gmail.com','7995013596','CSE-AI/ML','C','student','24a9bf40-48f6-420b-a3cc-14c3f1c9374f',1,'active',NULL,NULL);
INSERT INTO members VALUES(106,'25MVCSDR0078','Subhakanth Das ','subhakanthedu@gmail.com','6305623808','CSE-DS','A','student','7e1cce32-bedc-4363-8060-9f9e27a4f33f',1,'active',NULL,NULL);
INSERT INTO members VALUES(107,'25MVCSER0427','P durga prasad ','polipallidurgaprasad0427@gmail.com','8297227753','CSE','E','student','980fa133-3d25-46c7-81c9-5ae50e701652',1,'active',NULL,NULL);
INSERT INTO members VALUES(108,'25MVCSER0362','Amirishetti saharsh','amirishettisaharsh@gmail.com','8790818122','CSE','E','student','b999e493-1ebb-455c-9300-a9eca7a7bc44',1,'active',NULL,NULL);
INSERT INTO members VALUES(109,'25MVECER0074','RAYAPATI LAKSHMI CHETHU PRIYA ','rayapatilakshmichethupriya@gmail.com','8341905397','ECE','A','student','b8f9a1f4-2fac-4a50-babd-1eed46bf2c3c',1,'active',NULL,NULL);
INSERT INTO members VALUES(110,'25MVCSDR0369','Beesa Yashika','yashikabeesa@gmail.com','9618273536','CSE-DS','E','student','1d4004e2-ef51-48cd-833d-cd19f693b8e2',1,'active',NULL,NULL);
INSERT INTO members VALUES(111,'25MVCSMR0442','Nagatejaswi ','nagatejaswi098@gmail.com','9154111880','CSE-AI/ML','E','student','77e3bd18-b8f8-444f-893c-ff3a542dbf39',1,'active',NULL,NULL);
INSERT INTO members VALUES(112,'25MVCSER0142','VANSHITHA MERUGU','vanshithamerugu@gmail.com','8519877766','CSE','B','student','5f93561a-b5a2-40d0-b821-6191ce46c9ce',1,'active',NULL,NULL);
INSERT INTO members VALUES(113,'25MVCSMR0184','SATHVIK REDDY Y','sathvikreddyyampalla2522@gmail.com','7989059677','CSE-AI/ML','B','student','5b7a022b-5570-4417-90c9-e2948daa70e0',1,'active',NULL,NULL);
INSERT INTO members VALUES(114,'25MVECER0009','BUKKA YASHWITHA ','yashwithasammu@gmail.com','8688098028','ECE','A','student','97f0b8ab-f5e1-4906-ada4-e53885714893',1,'active',NULL,NULL);
INSERT INTO members VALUES(115,'25MVCSER0541','ANKAM VARSHITH','varshithankam0712@gmail.com','9705883676','CSE','G','student','8783ff74-7c07-4ac6-a376-abf08b4d30f6',1,'active',NULL,NULL);
INSERT INTO members VALUES(116,'25MVECEROO11','CHAKALI ABHINAV ','abhi871233@gmail.com','8712334236','ECE','A','student','87952016-bc8e-4be4-8ed7-e4b53a3afd6c',1,'active',NULL,NULL);
INSERT INTO members VALUES(117,'25MVCSDR0037','Kummari Archana','archanakummari462@gmail.com','7416968514','CSE-DS','A','student','62d7fcc1-cf64-445e-9859-282f914da6e9',1,'active',NULL,NULL);
INSERT INTO members VALUES(118,'25MVCSDR0136','M sidhartha ','mangaraisiddhartha@gmail.com','9515155954','CSE-DS','B','student','af9081b3-f183-4eac-a04b-f3f71d6d7ee3',1,'active',NULL,NULL);
INSERT INTO members VALUES(119,'25MVICBR0060','YANNAM AMARNATH REDDY ','amarnathreddy7721@gmail.com','9985428420','IOT/R&A','A','student','6d6356a6-515b-4548-b1ca-f839a7145a08',1,'active',NULL,NULL);
INSERT INTO members VALUES(120,'25MVCSDR0441','THAKKALLAPALLY MANOJ','manojrao5324@gmail.com','9391224183','CSE-DS','E','student','80bed73b-6eaa-431e-983f-c4d478e71c54',1,'active',NULL,NULL);
INSERT INTO members VALUES(121,'25MVCSDR0012','NAGI REDDY CHENNURI ','nagireddychennuri1@gmail.com','9000660856','CSE-DS','A','student','162b268e-d7dc-45e0-8d56-c5cb9e42d597',1,'active',NULL,NULL);
INSERT INTO members VALUES(122,'25MVCSDR0279','A. Nikhil Raju','anikhilraju09@gmail.com','8341144155','CSE-DS','D','student','43b79734-8a0c-4d03-89b2-a946bc1d8233',1,'active',NULL,NULL);
INSERT INTO members VALUES(123,'25MVCSDR0234','Rehan siddiq',NULL,'8712545141','CSE-DS','C','student','5c5b66b3-07ba-467f-b5ef-352b4f020d34',1,'active',NULL,NULL);
INSERT INTO members VALUES(124,'25MVCSMR0232','Kotipalli venkata Sai Akshith ','flameazuredragon@gmail.com','9963519689','CSE-AI/ML','C','student','a333228c-3fb7-4d5a-816c-d9099f326703',1,'active',NULL,NULL);
INSERT INTO members VALUES(125,'25MVCSER0039','Aditya sriram dora','adityasanju411@gmail.com','08919656196','CSE','A','student','5b7889af-a7e2-4e82-9467-0464bd44cf1b',1,'active',NULL,NULL);
INSERT INTO members VALUES(126,'25MVCSMR0086','Uppu srija ','uppusrija5@gmail.com','8074639954','CSE-AI/ML','A','student','7bfac442-04fb-4200-93fa-4eb09b5e1454',1,'active',NULL,NULL);
INSERT INTO members VALUES(127,'25MVCSDR0005','Ayyappa Sai Charitha','Charithaayyappa@gmail.com','9000533636','CSE-DS','A','student','d065e6cd-3cf2-4445-b75a-c9a58793761e',1,'active',NULL,NULL);
INSERT INTO members VALUES(128,'25MVCSDR0308','KUNTA SPURTHI REDDY','kuntaspurthireddy@gmail.com','8985873610','CSE-DS','D','student','37937751-61e0-4b82-b0d4-459c26bfa0ef',1,'active',NULL,NULL);
INSERT INTO members VALUES(129,'25MVCSDR0467','Gatla rohit ','gatlarohith234@gmail.com','8919947001','CSE-DS','F','student','4f878afd-d994-4684-9192-5674a1e8198d',1,'active',NULL,NULL);
INSERT INTO members VALUES(130,'25MVCSER0290','BURELA JOGESH VENKATA NEERAJ SURYA ','bjvneeraj0@gmail.com','9704210093','CSE','D','student','92940c20-f193-4a00-8483-e34370df8617',1,'active',NULL,NULL);
INSERT INTO members VALUES(131,'25MVCSDR0274','Airva Sneha Siri ','asnehasiri0304@gmail.com','7207151610','CSE-DS','D','student','72297d6d-dfc5-4817-b89d-abb309bac14a',1,'active',NULL,NULL);
INSERT INTO members VALUES(132,'25MVICBR0028','Malyala SriVardhan ','srivardhanmalyala284@gmail.com','8522812142','IOT/R&A','A','student','1c482c24-1ad7-4fc0-9a8a-3693233208ce',1,'active',NULL,NULL);
INSERT INTO members VALUES(133,'25MVCSER0134','Kunchala Venkata Sathya Narayana ','venkatsathya.kunchala16@gmail.com','8019109121','CSE','B','student','5063d2ae-18ed-404a-97f3-05d3a2243b4a',1,'active',NULL,NULL);
INSERT INTO members VALUES(134,'25MVBBAR0009','Gurajada Hyndhavi ','hyndhavigurajada07@gmail.com','8309926603','BBA','A','student','65f0a36f-9191-480a-ada0-fa9094f29244',1,'active',NULL,NULL);
INSERT INTO members VALUES(135,'25MVCSDR0442','Saketh thallapally','sakeththallapally03@gmail.com ','8328607959','CSE-DS','E','student','ff959bb9-c2e4-455c-8f0b-cd51fcf36826',1,'active',NULL,NULL);
INSERT INTO members VALUES(136,'25MVCSMR0537','Yalala Malishka ','malishkavarma@gmail.com ','8074243291','CSE-AI/ML','F','student','1dd70084-f5dd-4ad5-bc72-e6fc03a2171b',1,'active',NULL,NULL);
INSERT INTO members VALUES(137,'25MVCSER0185','Anumula Swetha','bunnysunny.2507@gmail.com','9390858343','CSE','C','student','357af6ca-6b0a-4615-bd15-0fb2531a2152',1,'active',NULL,NULL);
INSERT INTO members VALUES(138,'25MVICBR0051','SOBHANALA UDAYKIRAN ','udaykiranjo@gmail.com','6304886408','IOT/R&A','A','student','59b917b2-3e8d-4c13-8c4b-3070cbe0b1e6',1,'active',NULL,NULL);
INSERT INTO members VALUES(139,'25MVCSDR0465','E Hasini ','eskamallahasini@gmail.com','9391464851','CSE-DS','F','student','838d3b9c-fdd3-41ef-9d41-2a506923a9be',1,'active',NULL,NULL);
INSERT INTO members VALUES(140,'25MVBBA0467','Pulusu Siva Nagireddy','theshivforyou@gmail.com','9701792552','BBA','A','student','7f02bbb8-7f7e-4716-b6be-feb387aa6f01',1,'active',NULL,NULL);
INSERT INTO members VALUES(141,'25MVCSER0365','Arun patil','parunreddy630@gmail.com','9573513010','CSE','E','student','ccea612c-e199-4e31-89d8-ca9d5971772a',1,'active',NULL,NULL);
INSERT INTO members VALUES(142,'25MVCSER0202','Ganji pallavi ','ganjipallavi06@gmail.com','8341114751','CSE','C','student','bd40461c-aee9-45ae-8f34-c4302fde4ba2',1,'active',NULL,NULL);
INSERT INTO members VALUES(143,'25MVCSDR0450','Yellamelli Kalyani ','yellamellikalyani918@gmail.com','7382139311','CSE-DS','E','student','aa1c01ca-4fec-4433-abfe-7ae76dd49f07',1,'active',NULL,NULL);
INSERT INTO members VALUES(144,'25MVCSER0320','M.LEELA MADHURI ','leelamadhuri723@gmail.com','9849228299','CSE','D','student','e1791bcc-23d5-4dbb-a591-8f2436e678ce',1,'active',NULL,NULL);
INSERT INTO members VALUES(145,'25MVCSER0261','Usirikapalli Trisha ','trishausirikapalli@gmail.com','7842808523','CSE','C','student','b8f90d7f-4ea5-4f5c-9e85-ebc1ce9bf847',1,'active',NULL,NULL);
INSERT INTO members VALUES(146,'25MVCSDR0322','M.JEEVANI','mullapatijeevani@gmail.com','7995251444','CSE-DS','F','student','9adc498a-929c-48ab-9c6c-23d4caeca645',1,'active',NULL,NULL);
INSERT INTO members VALUES(147,'25MVCSER0182','Akshita sheoran','akshitasheoran77@gmail.com','9729395422','CSE','C','student','1905466c-1ad0-4267-b948-247cd325b5a3',1,'active',NULL,NULL);
INSERT INTO members VALUES(148,'25MVCSDR0509','Yasareni Greeshma ','yasarenigreeshma@gmail.com','8008458251','CSE-DS','F','student','ada3f243-6636-4a7d-8331-cf4d1ef63d5c',1,'active',NULL,NULL);
INSERT INTO members VALUES(149,'25MVECER0055','L. Indira ','indhureddy153@gmail.com','9346486749','ECE','A','student','c5e47291-4889-436c-bbe5-ad98caadf287',1,'active',NULL,NULL);
INSERT INTO members VALUES(150,'25MVCSER0465','Chenna poojitha ','poojithachennas@gmail.com','7288070755','CSE','F','student','0b3b10b3-8e05-4d4e-a422-6f9e765e2b6d',1,'active',NULL,NULL);
INSERT INTO members VALUES(151,'25MVCSER0246','Reddamoni Nishrutha ','nishruthareddamoni@gmail.com','8500458450','CSE','C','student','d6120c5a-84d3-4e84-aa45-ccb2ea10e18c',1,'active',NULL,NULL);
INSERT INTO members VALUES(152,'25MVCSER0295','CHINTAKINDI POOJA','chintakindipooja2008@gmail.com','9398719585','CSE','D','student','3ec2f56f-961b-41ac-9c0b-1475c52bf748',1,'active',NULL,NULL);
INSERT INTO members VALUES(153,'25MVCSER0057','Mallepally Chandra Priya Reddy ','mallepallychandrapriya@gmail.com','7842727769','CSE','A','student','f885233b-52b1-479d-b7ac-45ce45a2ce0c',1,'active',NULL,NULL);
INSERT INTO members VALUES(154,'25MVRAIR0016','Pagudala Harini ','pagudalaharini09@gmail.com','7386863491','IOT/R&A','A','student','cea7070b-28af-493f-ab80-6ad2477e1a5f',1,'active',NULL,NULL);
INSERT INTO members VALUES(155,'25MVCSDR0062','Peena Suthar',NULL,NULL,'CSE-DS','A','student','15b470c5-e9a8-4ba4-885c-34278346ed7a',1,'active',NULL,NULL);
INSERT INTO members VALUES(156,'25MVCSER0512','parne bhavani reddy',NULL,'9963216650','cse','f','student','00b4a064-7960-48fa-825d-a81f04218ba6',1,'active',NULL,NULL);
INSERT INTO members VALUES(157,'FAC-Mr. Nalamasa Ramesh','Mr. Nalamasa Ramesh','coord@clubpass.com','7801013094','ECE','-','faculty','9996cb37-4061-4d82-96b1-ba66e7718980',1,'active',NULL,NULL);
INSERT INTO members VALUES(158,'FAC-Mr. Anand Adlakadi','Mr. Anand Adlakadi',NULL,'9493005533','CSE (AIML)','-','faculty','7b80a83b-e88b-418c-a33d-49ec9f2ee1f9',1,'active',NULL,NULL);
INSERT INTO members VALUES(159,'FAC-Ms. M. Devarshini','Ms. M. Devarshini',NULL,'7989308244','CSE (DS)','-','faculty','1e084c2b-6a25-4274-bead-6366fac16560',1,'active',NULL,NULL);
INSERT INTO members VALUES(160,'FAC-Ms. Vaddepelli Sathwika','Ms. Vaddepelli Sathwika',NULL,'9550966508','CSE (AIML)','-','faculty','7ed3ec10-43ab-45ce-8f54-67e0e205d8d4',1,'active',NULL,NULL);
INSERT INTO members VALUES(161,'FAC-Mrs. Jhili Patro','Mrs. Jhili Patro',NULL,'8328667098','CSE','-','faculty','5feaa953-8441-41e5-9b4e-beab8940b83e',1,'active',NULL,NULL);
INSERT INTO members VALUES(162,'FAC-Ms. Pillarisetty Alekhya','Ms. Pillarisetty Alekhya',NULL,'7095672673','CSE (AIML)','-','faculty','273d7518-90af-431e-ad4d-6ee761438520',1,'active',NULL,NULL);
INSERT INTO members VALUES(163,'FAC-Mr. Madgula Mahesh','Mr. Madgula Mahesh',NULL,'8885379664','CSE','-','faculty','07b82fd5-5295-4b1e-ba2a-895b4952dc34',1,'active',NULL,NULL);
INSERT INTO members VALUES(164,'FAC-Mr. Susanta Sahu','Mr. Susanta Sahu',NULL,'7396961462','CSE (DS)','-','faculty','3164f020-bd3c-4801-8e61-c8bec057c7da',1,'active',NULL,NULL);
INSERT INTO members VALUES(165,'FAC-Ms. Dyavanapally Shirishha','Ms. Dyavanapally Shirishha',NULL,'9515303010','CSE','-','faculty','51f1ab15-2b71-4a5c-a717-a145195f8f1b',1,'active',NULL,NULL);
INSERT INTO members VALUES(166,'FAC-Ms. Noureen Tabassum','Ms. Noureen Tabassum',NULL,'8341591295','ECE','-','faculty','26ceb551-d896-4e8f-9adf-093bf4ff28f5',1,'active',NULL,NULL);
INSERT INTO members VALUES(167,'FAC-Mr. M. Srikanth','Mr. M. Srikanth',NULL,'9100091945','CSE (AIML)','-','faculty','df5edd19-7438-4212-8505-f89188994d1e',1,'active',NULL,NULL);
INSERT INTO members VALUES(168,'FAC-Mr. A. Paparao','Mr. A. Paparao',NULL,'9985857459','BBA','-','faculty','02fc97ed-1c44-4340-b61e-9e5848a2b2a5',1,'active',NULL,NULL);
INSERT INTO members VALUES(169,'FAC-Mr. G. Harish Reddy','Mr. G. Harish Reddy',NULL,'9848380100','CSE (DS)','-','faculty','d88d311b-fb05-4361-b080-d7846693e6f4',1,'active',NULL,NULL);
INSERT INTO members VALUES(170,'FAC-Mr. Venkateshwara Rao','Mr. Venkateshwara Rao',NULL,'9985266986','CSE','-','faculty','67bdfac4-087a-44a1-a115-7bc8eaef7944',1,'active',NULL,NULL);
INSERT INTO members VALUES(171,'FAC-Mrs. Tanneru Venkata Lavanya','Mrs. Tanneru Venkata Lavanya',NULL,'9550213344','CSE','-','faculty','a3e0dc20-4edd-4ee7-a5a7-122248c56a62',1,'active',NULL,NULL);
INSERT INTO members VALUES(172,'FAC-Mrs. V. Nikitha','Mrs. V. Nikitha',NULL,'7386856565','CSE (DS)','-','faculty','13992577-6c54-4d2f-bb0b-fc7478cc32d2',1,'active',NULL,NULL);
CREATE TABLE member_clubs(member_id INT,club_id INT,role TEXT,PRIMARY KEY(member_id,club_id));
INSERT INTO member_clubs VALUES(1,1,'member');
INSERT INTO member_clubs VALUES(2,1,'member');
INSERT INTO member_clubs VALUES(3,1,'member');
INSERT INTO member_clubs VALUES(4,1,'member');
INSERT INTO member_clubs VALUES(5,1,'member');
INSERT INTO member_clubs VALUES(6,1,'member');
INSERT INTO member_clubs VALUES(7,1,'member');
INSERT INTO member_clubs VALUES(8,1,'member');
INSERT INTO member_clubs VALUES(9,1,'member');
INSERT INTO member_clubs VALUES(10,1,'member');
INSERT INTO member_clubs VALUES(11,1,'member');
INSERT INTO member_clubs VALUES(12,1,'member');
INSERT INTO member_clubs VALUES(13,1,'member');
INSERT INTO member_clubs VALUES(14,1,'member');
INSERT INTO member_clubs VALUES(15,1,'member');
INSERT INTO member_clubs VALUES(16,1,'member');
INSERT INTO member_clubs VALUES(17,1,'member');
INSERT INTO member_clubs VALUES(18,1,'member');
INSERT INTO member_clubs VALUES(19,1,'member');
INSERT INTO member_clubs VALUES(20,1,'member');
INSERT INTO member_clubs VALUES(21,1,'member');
INSERT INTO member_clubs VALUES(22,1,'member');
INSERT INTO member_clubs VALUES(23,1,'member');
INSERT INTO member_clubs VALUES(24,2,'member');
INSERT INTO member_clubs VALUES(25,2,'member');
INSERT INTO member_clubs VALUES(26,2,'member');
INSERT INTO member_clubs VALUES(27,2,'member');
INSERT INTO member_clubs VALUES(28,2,'member');
INSERT INTO member_clubs VALUES(29,2,'member');
INSERT INTO member_clubs VALUES(30,2,'member');
INSERT INTO member_clubs VALUES(31,2,'member');
INSERT INTO member_clubs VALUES(32,2,'member');
INSERT INTO member_clubs VALUES(33,2,'member');
INSERT INTO member_clubs VALUES(34,2,'member');
INSERT INTO member_clubs VALUES(35,2,'member');
INSERT INTO member_clubs VALUES(36,2,'member');
INSERT INTO member_clubs VALUES(37,2,'member');
INSERT INTO member_clubs VALUES(38,2,'member');
INSERT INTO member_clubs VALUES(39,2,'member');
INSERT INTO member_clubs VALUES(40,2,'member');
INSERT INTO member_clubs VALUES(41,2,'member');
INSERT INTO member_clubs VALUES(42,2,'member');
INSERT INTO member_clubs VALUES(43,2,'member');
INSERT INTO member_clubs VALUES(44,2,'member');
INSERT INTO member_clubs VALUES(45,2,'member');
INSERT INTO member_clubs VALUES(46,3,'member');
INSERT INTO member_clubs VALUES(47,3,'member');
INSERT INTO member_clubs VALUES(48,3,'member');
INSERT INTO member_clubs VALUES(49,3,'member');
INSERT INTO member_clubs VALUES(50,3,'member');
INSERT INTO member_clubs VALUES(51,3,'member');
INSERT INTO member_clubs VALUES(52,3,'member');
INSERT INTO member_clubs VALUES(53,3,'member');
INSERT INTO member_clubs VALUES(54,3,'member');
INSERT INTO member_clubs VALUES(55,3,'member');
INSERT INTO member_clubs VALUES(56,3,'member');
INSERT INTO member_clubs VALUES(57,3,'member');
INSERT INTO member_clubs VALUES(58,3,'member');
INSERT INTO member_clubs VALUES(59,3,'member');
INSERT INTO member_clubs VALUES(60,3,'member');
INSERT INTO member_clubs VALUES(61,3,'member');
INSERT INTO member_clubs VALUES(62,3,'member');
INSERT INTO member_clubs VALUES(63,3,'member');
INSERT INTO member_clubs VALUES(64,3,'member');
INSERT INTO member_clubs VALUES(65,3,'member');
INSERT INTO member_clubs VALUES(66,4,'member');
INSERT INTO member_clubs VALUES(67,4,'member');
INSERT INTO member_clubs VALUES(68,4,'member');
INSERT INTO member_clubs VALUES(69,4,'member');
INSERT INTO member_clubs VALUES(70,4,'member');
INSERT INTO member_clubs VALUES(71,4,'member');
INSERT INTO member_clubs VALUES(72,4,'member');
INSERT INTO member_clubs VALUES(73,4,'member');
INSERT INTO member_clubs VALUES(74,4,'member');
INSERT INTO member_clubs VALUES(75,4,'member');
INSERT INTO member_clubs VALUES(76,4,'member');
INSERT INTO member_clubs VALUES(77,4,'member');
INSERT INTO member_clubs VALUES(78,4,'member');
INSERT INTO member_clubs VALUES(79,4,'member');
INSERT INTO member_clubs VALUES(80,4,'member');
INSERT INTO member_clubs VALUES(81,4,'member');
INSERT INTO member_clubs VALUES(82,4,'member');
INSERT INTO member_clubs VALUES(83,4,'member');
INSERT INTO member_clubs VALUES(84,4,'member');
INSERT INTO member_clubs VALUES(85,4,'member');
INSERT INTO member_clubs VALUES(86,5,'member');
INSERT INTO member_clubs VALUES(87,5,'member');
INSERT INTO member_clubs VALUES(88,5,'member');
INSERT INTO member_clubs VALUES(89,5,'member');
INSERT INTO member_clubs VALUES(90,5,'member');
INSERT INTO member_clubs VALUES(91,5,'member');
INSERT INTO member_clubs VALUES(92,5,'member');
INSERT INTO member_clubs VALUES(93,5,'member');
INSERT INTO member_clubs VALUES(94,5,'member');
INSERT INTO member_clubs VALUES(95,5,'member');
INSERT INTO member_clubs VALUES(96,5,'member');
INSERT INTO member_clubs VALUES(97,5,'member');
INSERT INTO member_clubs VALUES(98,5,'member');
INSERT INTO member_clubs VALUES(99,5,'member');
INSERT INTO member_clubs VALUES(100,5,'member');
INSERT INTO member_clubs VALUES(101,5,'member');
INSERT INTO member_clubs VALUES(102,5,'member');
INSERT INTO member_clubs VALUES(103,5,'member');
INSERT INTO member_clubs VALUES(104,5,'member');
INSERT INTO member_clubs VALUES(105,6,'member');
INSERT INTO member_clubs VALUES(106,6,'member');
INSERT INTO member_clubs VALUES(107,6,'member');
INSERT INTO member_clubs VALUES(108,6,'member');
INSERT INTO member_clubs VALUES(109,6,'member');
INSERT INTO member_clubs VALUES(110,6,'member');
INSERT INTO member_clubs VALUES(111,6,'member');
INSERT INTO member_clubs VALUES(112,6,'member');
INSERT INTO member_clubs VALUES(113,6,'member');
INSERT INTO member_clubs VALUES(114,6,'member');
INSERT INTO member_clubs VALUES(115,6,'member');
INSERT INTO member_clubs VALUES(116,6,'member');
INSERT INTO member_clubs VALUES(117,6,'member');
INSERT INTO member_clubs VALUES(118,6,'member');
INSERT INTO member_clubs VALUES(119,6,'member');
INSERT INTO member_clubs VALUES(120,6,'member');
INSERT INTO member_clubs VALUES(121,6,'member');
INSERT INTO member_clubs VALUES(122,6,'member');
INSERT INTO member_clubs VALUES(123,6,'member');
INSERT INTO member_clubs VALUES(124,7,'member');
INSERT INTO member_clubs VALUES(125,7,'member');
INSERT INTO member_clubs VALUES(126,7,'member');
INSERT INTO member_clubs VALUES(127,7,'member');
INSERT INTO member_clubs VALUES(128,7,'member');
INSERT INTO member_clubs VALUES(129,7,'member');
INSERT INTO member_clubs VALUES(130,7,'member');
INSERT INTO member_clubs VALUES(131,7,'member');
INSERT INTO member_clubs VALUES(132,7,'member');
INSERT INTO member_clubs VALUES(133,7,'member');
INSERT INTO member_clubs VALUES(134,7,'member');
INSERT INTO member_clubs VALUES(135,7,'member');
INSERT INTO member_clubs VALUES(136,7,'member');
INSERT INTO member_clubs VALUES(137,7,'member');
INSERT INTO member_clubs VALUES(138,7,'member');
INSERT INTO member_clubs VALUES(139,7,'member');
INSERT INTO member_clubs VALUES(140,7,'member');
INSERT INTO member_clubs VALUES(141,7,'member');
INSERT INTO member_clubs VALUES(142,8,'member');
INSERT INTO member_clubs VALUES(143,8,'member');
INSERT INTO member_clubs VALUES(144,8,'member');
INSERT INTO member_clubs VALUES(145,8,'member');
INSERT INTO member_clubs VALUES(146,8,'member');
INSERT INTO member_clubs VALUES(147,8,'member');
INSERT INTO member_clubs VALUES(148,8,'member');
INSERT INTO member_clubs VALUES(149,8,'member');
INSERT INTO member_clubs VALUES(150,8,'member');
INSERT INTO member_clubs VALUES(151,8,'member');
INSERT INTO member_clubs VALUES(152,8,'member');
INSERT INTO member_clubs VALUES(153,8,'member');
INSERT INTO member_clubs VALUES(154,8,'member');
INSERT INTO member_clubs VALUES(155,8,'member');
INSERT INTO member_clubs VALUES(156,8,'member');
INSERT INTO member_clubs VALUES(157,9,'coordinator');
INSERT INTO member_clubs VALUES(158,9,'coordinator');
INSERT INTO member_clubs VALUES(159,9,'coordinator');
INSERT INTO member_clubs VALUES(160,9,'coordinator');
INSERT INTO member_clubs VALUES(161,9,'coordinator');
INSERT INTO member_clubs VALUES(162,9,'coordinator');
INSERT INTO member_clubs VALUES(163,9,'coordinator');
INSERT INTO member_clubs VALUES(164,9,'coordinator');
INSERT INTO member_clubs VALUES(165,9,'coordinator');
INSERT INTO member_clubs VALUES(166,9,'coordinator');
INSERT INTO member_clubs VALUES(167,9,'coordinator');
INSERT INTO member_clubs VALUES(168,9,'coordinator');
INSERT INTO member_clubs VALUES(169,9,'coordinator');
INSERT INTO member_clubs VALUES(170,9,'coordinator');
INSERT INTO member_clubs VALUES(171,9,'coordinator');
INSERT INTO member_clubs VALUES(172,9,'coordinator');
CREATE TABLE hods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO hods VALUES('hod-001','Dr. HOD','CSE','hod@clubpass.com','$2b$10$EWCuguKMjIyecM20ummiI.Z5DF8VXMZ6TecqeJabawFxEnUx3nWNe','2026-07-12 18:33:33');
CREATE TABLE admins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Admin',
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO admins VALUES('admin-001','Super Admin','admin@clubpass.com','$2b$10$7Wq2MJIiXzh07oKIzYvv1O1.NFvlPYtdckwq5BuxEb.jkd0iqFz9O','2026-07-12 18:33:33');
CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  member_uuid TEXT NOT NULL,
  hod_id TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT '',
  remark TEXT,
  status TEXT DEFAULT 'granted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(member_uuid, date)
);
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  recipient_id TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  related_member_uuid TEXT,
  read_status INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_members_uuid ON members(uuid);
CREATE INDEX idx_members_roll ON members(roll_number);
CREATE INDEX idx_permissions_member_date ON permissions(member_uuid, date);
CREATE INDEX idx_permissions_date ON permissions(date);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, read_status);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
CREATE INDEX idx_audit_action ON audit_logs(action);
