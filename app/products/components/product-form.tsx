'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";


import { Trash } from "lucide-react";
import Heading from "@/components/shared/heading";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const FeatureSchema = z.object({
  name: z.string(),
  value: z.string(),
});
const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(4),
  description: z
    .string()
    .max(250),
  price: z
    .coerce.number({ required_error: "Price is required" })
    .min(1),
  category_ids: z
    .string({ required_error: "At least one category is required" })
    .array(),
  image_ids: z
    .string({ required_error: "At least one image is required" })
    .array(),
  is_featured: z.boolean().default(false).optional(),
  is_archived: z.boolean().default(false).optional(),
  features: z.array(FeatureSchema),
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: {
    name: string;
    description: string;
    size_ids: string[];
    category_ids: string[];
    price: number;
    image_ids: string[];
    is_featured: boolean;
    is_archived: boolean;
    features: object[];
  } | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => { fetchCategories(null) }, [])

  const fetchCategories = (id: string | null) => {
    axios.get("YOUR_API_ENDPOINT/categories", {
      params: {
        parentId: id
      }
    })
      .then(response => {
        // Update categories state with fetched data
        setCategories([...categories,]);
      })
      .catch(error => {
        // Handle errors if any
        console.error("Error fetching categories:", error);
      });
  };

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData
    ? "Product updated."
    : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  console.log(useForm)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      category_ids: [],
      price: 0,
      image_ids: [],
      is_featured: false,
      is_archived: false,
      features: []
    },
  });



  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/v1/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/v1/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/v1/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all categories using this billboard first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };


  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Decription"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Categories"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Images"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured</FormLabel>
                  <FormControl>
                    <Checkbox disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_archived"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Archived</FormLabel>
                  <FormControl>
                    <Checkbox disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}

const MOCK_DATA = [
  {
    "id": 1,
    "name": "Men's Apparel",
    "parentId": null
  },
  {
    "id": 101,
    "name": "T-Shirts",
    "parentId": 1
  },
  {
    "id": 102,
    "name": "Shirts",
    "parentId": 1
  },
  {
    "id": 1001,
    "name": "Round Neck",
    "parentId": 101
  },
  {
    "id": 1002,
    "name": "V-Neck",
    "parentId": 101
  },
  {
    "id": 1003,
    "name": "Casual Shirts",
    "parentId": 102
  },
  {
    "id": 1004,
    "name": "Formal Shirts",
    "parentId": 102
  },
  {
    "id": 2,
    "name": "Women's Apparel",
    "parentId": null
  },
  {
    "id": 201,
    "name": "Dresses",
    "parentId": 2
  },
  {
    "id": 202,
    "name": "Blouses",
    "parentId": 2
  },
  {
    "id": 2001,
    "name": "Summer Dresses",
    "parentId": 201
  },
  {
    "id": 2002,
    "name": "Evening Dresses",
    "parentId": 201
  },
  {
    "id": 2003,
    "name": "Sleeveless Blouses",
    "parentId": 202
  },
  {
    "id": 2004,
    "name": "Long Sleeve Blouses",
    "parentId": 202
  }
]
