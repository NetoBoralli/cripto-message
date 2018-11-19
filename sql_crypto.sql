
create view [dbo].[rand_view] as
select rand() value;
go

create function [dbo].[get_random](@min int, @max int) returns int as
begin
	return round(((@max-@min-1)*(select r.value from rand_view r)+@min),0);
end
go

create function [dbo].[get_random_chars](@chars varchar(max), @len int) returns varchar(max) as
begin
	declare @aux varchar(max) set @aux='';
	declare @count int set @count=0;
	while (@count<@len)
	begin
		declare @r int set @r=dbo.get_random(1,len(@chars));
		set @aux+=substring(@chars,@r,1);
		set @count+=1;
	end
	return @aux;
end
go

create function [dbo].[new_id]() returns char(8) as
begin
	return [dbo].[get_random_chars]('0123456789ABCDEFGHIJKLMNOPQRSTUVXWYZabcdefghijklmnopqrstuvxwyz',(8));
end
go

create table dbo.users (
	id int identity(1,1) not null,
	identifier char(8) not null default([dbo].[new_id]()),
	username varchar(100) not null,
	email varchar(100) not null,
	password varchar(50) not null,
	public_key varchar(max),
	constraint PK_users primary key (id),
	constraint UQ_users_1 unique (email),
);
go

create table dbo.messages (
	id int identity(1,1) not null,
	identifier char(8) not null default([dbo].[new_id]()),
	receiver_id int not null,
	sender_id int not null,
	sender_encrypted_message varchar(max) not null,
	receiver_encrypted_message varchar(max) not null,
	constraint PK_types primary key (id),
);
go